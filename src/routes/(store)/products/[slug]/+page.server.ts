import type { PageServerLoad } from './$types';
import { getProductBySlug } from '$lib/server/product';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const product = await getProductBySlug(params.slug);

	if (!product) {
		throw error(404, 'Product not found');
	}

	return {
		product
	};
};
