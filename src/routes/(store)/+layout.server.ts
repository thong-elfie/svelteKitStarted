import type { LayoutServerLoad } from './$types';
import { getAllProducts } from '$lib/server/product';

export const load: LayoutServerLoad = async () => {
	const products = await getAllProducts();
	return {
		products
	};
};
