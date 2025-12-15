import type { PageServerLoad } from './$types';
import { getAllOrders } from '$lib/server/order';

export const load: PageServerLoad = async () => {
	const orders = await getAllOrders();
	return {
		orders
	};
};
