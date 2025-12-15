import type { PaymentIntent, PaymentWebhookData, PaymentStatus } from '$types';

export interface PaymentProvider {
	createPaymentIntent(data: {
		orderId: string;
		amount: number;
		returnUrl: string;
		metadata?: Record<string, unknown>;
	}): Promise<PaymentIntent>;

	verifyWebhook(payload: string, signature: string): boolean;

	parseWebhookData(payload: string): PaymentWebhookData;
}

export function getPaymentProvider(): PaymentProvider {
	const provider = process.env.PAYMENT_PROVIDER || 'stripe';

	switch (provider) {
		case 'stripe':
			return new StripeProvider();
		case 'vnpay':
			return new VNPayProvider();
		default:
			throw new Error(`Unknown payment provider: ${provider}`);
	}
}

class StripeProvider implements PaymentProvider {
	async createPaymentIntent(data: {
		orderId: string;
		amount: number;
		returnUrl: string;
		metadata?: Record<string, unknown>;
	}): Promise<PaymentIntent> {
		const stripe = await import('stripe').then((m) => new m.default(process.env.STRIPE_SECRET_KEY!));

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price_data: {
						currency: 'usd',
						product_data: {
							name: `Order #${data.orderId}`
						},
						unit_amount: data.amount
					},
					quantity: 1
				}
			],
			mode: 'payment',
			success_url: `${data.returnUrl}?success=true&order_id=${data.orderId}`,
			cancel_url: `${data.returnUrl}?canceled=true&order_id=${data.orderId}`,
			metadata: {
				orderId: data.orderId,
				...data.metadata
			}
		});

		return {
			orderId: data.orderId,
			amount: data.amount,
			redirectUrl: session.url!,
			metadata: {
				sessionId: session.id
			}
		};
	}

	verifyWebhook(payload: string, signature: string): boolean {
		try {
			const stripe = new (require('stripe').default)(process.env.STRIPE_SECRET_KEY!);
			stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!);
			return true;
		} catch {
			return false;
		}
	}

	parseWebhookData(payload: string): PaymentWebhookData {
		const event = JSON.parse(payload);
		const session = event.data.object;

		let status: PaymentStatus = 'PENDING';
		if (event.type === 'checkout.session.completed') {
			status = 'COMPLETED';
		} else if (event.type === 'checkout.session.expired') {
			status = 'FAILED';
		}

		return {
			provider: 'stripe',
			orderId: session.metadata.orderId,
			status,
			providerOrderId: session.id,
			metadata: session
		};
	}
}

class VNPayProvider implements PaymentProvider {
	async createPaymentIntent(data: {
		orderId: string;
		amount: number;
		returnUrl: string;
		metadata?: Record<string, unknown>;
	}): Promise<PaymentIntent> {
		const crypto = await import('crypto');
		const querystring = await import('querystring');

		const vnpUrl = process.env.VNPAY_URL!;
		const tmnCode = process.env.VNPAY_TMN_CODE!;
		const secretKey = process.env.VNPAY_HASH_SECRET!;

		const createDate = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
		const orderId = data.orderId;

		const vnpParams: Record<string, string> = {
			vnp_Version: '2.1.0',
			vnp_Command: 'pay',
			vnp_TmnCode: tmnCode,
			vnp_Amount: (data.amount * 100).toString(),
			vnp_CreateDate: createDate,
			vnp_CurrCode: 'VND',
			vnp_IpAddr: '127.0.0.1',
			vnp_Locale: 'vn',
			vnp_OrderInfo: `Payment for order ${orderId}`,
			vnp_OrderType: 'other',
			vnp_ReturnUrl: data.returnUrl,
			vnp_TxnRef: orderId
		};

		const sortedParams = Object.keys(vnpParams)
			.sort()
			.reduce((acc, key) => {
				acc[key] = vnpParams[key];
				return acc;
			}, {} as Record<string, string>);

		const signData = querystring.stringify(sortedParams);
		const hmac = crypto.createHmac('sha512', secretKey);
		const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

		sortedParams['vnp_SecureHash'] = signed;

		const redirectUrl = vnpUrl + '?' + querystring.stringify(sortedParams);

		return {
			orderId: data.orderId,
			amount: data.amount,
			redirectUrl,
			metadata: sortedParams
		};
	}

	verifyWebhook(payload: string, signature: string): boolean {
		const crypto = require('crypto');
		const secretKey = process.env.VNPAY_HASH_SECRET!;

		const hmac = crypto.createHmac('sha512', secretKey);
		const signed = hmac.update(Buffer.from(payload, 'utf-8')).digest('hex');

		return signed === signature;
	}

	parseWebhookData(payload: string): PaymentWebhookData {
		const params = JSON.parse(payload);

		let status: PaymentStatus = 'PENDING';
		if (params.vnp_ResponseCode === '00') {
			status = 'COMPLETED';
		} else {
			status = 'FAILED';
		}

		return {
			provider: 'vnpay',
			orderId: params.vnp_TxnRef,
			status,
			providerOrderId: params.vnp_TransactionNo,
			metadata: params
		};
	}
}
