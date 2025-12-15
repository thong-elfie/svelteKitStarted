import { db } from '../db';
import { getProductsByIds, decrementStock } from '../product';
import type { Order, OrderItem, CreateOrderData } from '$types';

export async function createOrder(data: CreateOrderData): Promise<Order> {
	const products = await getProductsByIds(data.items.map((item) => item.productId));

	const productMap = new Map(products.map((p) => [p.id, p]));

	for (const item of data.items) {
		const product = productMap.get(item.productId);
		if (!product) {
			throw new Error(`Product ${item.productId} not found`);
		}
		if (product.stock < item.quantity) {
			throw new Error(`Insufficient stock for product ${product.name}`);
		}
	}

	const total = data.items.reduce((sum, item) => {
		const product = productMap.get(item.productId)!;
		return sum + product.price * item.quantity;
	}, 0);

	const order = await db.order.create({
		data: {
			userId: data.userId,
			total,
			shippingName: data.shipping.name,
			shippingEmail: data.shipping.email,
			shippingPhone: data.shipping.phone,
			shippingAddress: data.shipping.address,
			items: {
				create: data.items.map((item) => ({
					productId: item.productId,
					quantity: item.quantity,
					price: productMap.get(item.productId)!.price
				}))
			}
		}
	});

	return order;
}

export async function getOrderById(id: string): Promise<(Order & { items: OrderItem[] }) | null> {
	return db.order.findUnique({
		where: { id },
		include: {
			items: true
		}
	});
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
	return db.order.findMany({
		where: { userId },
		orderBy: { createdAt: 'desc' }
	});
}

export async function getAllOrders(): Promise<Order[]> {
	return db.order.findMany({
		orderBy: { createdAt: 'desc' }
	});
}

export async function updateOrderStatus(
	orderId: string,
	status: Order['status']
): Promise<Order> {
	return db.order.update({
		where: { id: orderId },
		data: { status }
	});
}

export async function markOrderAsPaid(orderId: string): Promise<Order> {
	const order = await getOrderById(orderId);
	if (!order) {
		throw new Error('Order not found');
	}

	for (const item of order.items) {
		await decrementStock(item.productId, item.quantity);
	}

	return updateOrderStatus(orderId, 'PAID');
}
