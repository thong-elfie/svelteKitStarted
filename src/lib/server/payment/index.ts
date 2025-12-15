import { db } from '../db';
import { getPaymentProvider } from './provider';
import type { Payment, PaymentIntent, PaymentWebhookData } from '$types';

export async function createPayment(data: {
	orderId: string;
	amount: number;
	returnUrl: string;
}): Promise<PaymentIntent> {
	const provider = getPaymentProvider();

	const existingPayment = await db.payment.findUnique({
		where: { orderId: data.orderId }
	});

	if (existingPayment) {
		throw new Error('Payment already exists for this order');
	}

	await db.payment.create({
		data: {
			orderId: data.orderId,
			provider: process.env.PAYMENT_PROVIDER || 'stripe',
			amount: data.amount,
			status: 'PENDING'
		}
	});

	const intent = await provider.createPaymentIntent({
		orderId: data.orderId,
		amount: data.amount,
		returnUrl: data.returnUrl
	});

	await db.payment.update({
		where: { orderId: data.orderId },
		data: {
			metadata: intent.metadata as any
		}
	});

	return intent;
}

export async function handleWebhook(
	payload: string,
	signature: string
): Promise<PaymentWebhookData> {
	const provider = getPaymentProvider();

	const isValid = provider.verifyWebhook(payload, signature);
	if (!isValid) {
		throw new Error('Invalid webhook signature');
	}

	const webhookData = provider.parseWebhookData(payload);

	await db.payment.update({
		where: { orderId: webhookData.orderId },
		data: {
			status: webhookData.status,
			providerOrderId: webhookData.providerOrderId,
			metadata: webhookData.metadata as any
		}
	});

	return webhookData;
}

export async function getPaymentByOrderId(orderId: string): Promise<Payment | null> {
	return db.payment.findUnique({
		where: { orderId }
	});
}

export async function updatePaymentStatus(
	orderId: string,
	status: Payment['status']
): Promise<Payment> {
	return db.payment.update({
		where: { orderId },
		data: { status }
	});
}
