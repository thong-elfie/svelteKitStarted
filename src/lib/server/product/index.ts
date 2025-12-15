import { db } from '../db';
import type { Product } from '$types';

export async function getAllProducts(activeOnly = true): Promise<Product[]> {
	const products = await db.product.findMany({
		where: activeOnly ? { isActive: true } : undefined,
		orderBy: { createdAt: 'desc' }
	});

	return products;
}

export async function getProductById(id: string): Promise<Product | null> {
	return db.product.findUnique({
		where: { id }
	});
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
	return db.product.findUnique({
		where: { slug }
	});
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
	return db.product.findMany({
		where: {
			id: { in: ids }
		}
	});
}

export async function createProduct(data: {
	name: string;
	slug: string;
	description?: string;
	price: number;
	image?: string;
	stock?: number;
}): Promise<Product> {
	return db.product.create({
		data: {
			name: data.name,
			slug: data.slug,
			description: data.description ?? null,
			price: data.price,
			image: data.image ?? null,
			stock: data.stock ?? 0
		}
	});
}

export async function updateProduct(
	id: string,
	data: Partial<{
		name: string;
		slug: string;
		description: string | null;
		price: number;
		image: string | null;
		stock: number;
		isActive: boolean;
	}>
): Promise<Product> {
	return db.product.update({
		where: { id },
		data
	});
}

export async function deleteProduct(id: string): Promise<void> {
	await db.product.delete({
		where: { id }
	});
}

export async function decrementStock(productId: string, quantity: number): Promise<void> {
	await db.product.update({
		where: { id: productId },
		data: {
			stock: {
				decrement: quantity
			}
		}
	});
}
