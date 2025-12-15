import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { handleWebhook } from '$lib/server/payment';
import { markOrderAsPaid } from '$lib/server/order';

export const POST: RequestHandler = async ({ request }) => {
	const signature = request.headers.get('stripe-signature') || request.headers.get('x-vnpay-signature') || '';
	const payload = await request.text();

	try {
		const webhookData = await handleWebhook(payload, signature);

		if (webhookData.status === 'COMPLETED') {
			await markOrderAsPaid(webhookData.orderId);
		}

		return json({ received: true });
	} catch (error) {
		console.error('Webhook error:', error);
		return json({ error: (error as Error).message }, { status: 400 });
	}
};
