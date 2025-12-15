import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createPayment } from '$lib/server/payment';

export const POST: RequestHandler = async ({ request, locals, url }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { orderId } = await request.json();

	if (!orderId) {
		return json({ error: 'Order ID is required' }, { status: 400 });
	}

	try {
		const returnUrl = `${url.origin}/checkout/return`;

		const intent = await createPayment({
			orderId,
			amount: 0,
			returnUrl
		});

		return json({ intent });
	} catch (error) {
		return json({ error: (error as Error).message }, { status: 400 });
	}
};
