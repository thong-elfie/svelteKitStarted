import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createOrder } from '$lib/server/order';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const data = await request.json();

	if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
		return json({ error: 'Items are required' }, { status: 400 });
	}

	if (!data.shipping || !data.shipping.name || !data.shipping.email || !data.shipping.phone || !data.shipping.address) {
		return json({ error: 'Shipping information is required' }, { status: 400 });
	}

	try {
		const order = await createOrder({
			userId: locals.user.id,
			items: data.items,
			shipping: data.shipping
		});

		return json({ order });
	} catch (error) {
		return json({ error: (error as Error).message }, { status: 400 });
	}
};
