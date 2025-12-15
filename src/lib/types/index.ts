export type UserRole = 'USER' | 'ADMIN';

export type OrderStatus = 
	| 'PENDING' 
	| 'PAID' 
	| 'PROCESSING' 
	| 'SHIPPED' 
	| 'DELIVERED' 
	| 'CANCELLED' 
	| 'REFUNDED';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface User {
	id: string;
	email: string;
	name: string | null;
	role: UserRole;
	createdAt: Date;
	updatedAt: Date;
}

export interface Session {
	id: string;
	userId: string;
	expiresAt: Date;
	createdAt: Date;
}

export interface Product {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	price: number;
	image: string | null;
	stock: number;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface Order {
	id: string;
	userId: string;
	status: OrderStatus;
	total: number;
	shippingName: string;
	shippingEmail: string;
	shippingPhone: string;
	shippingAddress: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface OrderItem {
	id: string;
	orderId: string;
	productId: string;
	quantity: number;
	price: number;
}

export interface Payment {
	id: string;
	orderId: string;
	provider: string;
	providerOrderId: string | null;
	amount: number;
	status: PaymentStatus;
	metadata: Record<string, unknown> | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface CartItem {
	productId: string;
	quantity: number;
	product?: Product;
}

export interface CreateOrderData {
	userId: string;
	items: Array<{
		productId: string;
		quantity: number;
	}>;
	shipping: {
		name: string;
		email: string;
		phone: string;
		address: string;
	};
}

export interface PaymentIntent {
	orderId: string;
	amount: number;
	redirectUrl: string;
	metadata?: Record<string, unknown>;
}

export interface PaymentWebhookData {
	provider: string;
	orderId: string;
	status: PaymentStatus;
	providerOrderId?: string;
	metadata?: Record<string, unknown>;
}
