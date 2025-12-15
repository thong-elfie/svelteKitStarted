import { writable } from 'svelte/store';
import type { CartItem } from '$types';

function createCartStore() {
	const { subscribe, set, update } = writable<CartItem[]>([]);

	return {
		subscribe,
		addItem: (productId: string, quantity: number = 1) => {
			update((items) => {
				const existingItem = items.find((item) => item.productId === productId);
				if (existingItem) {
					existingItem.quantity += quantity;
					return items;
				}
				return [...items, { productId, quantity }];
			});
		},
		removeItem: (productId: string) => {
			update((items) => items.filter((item) => item.productId !== productId));
		},
		updateQuantity: (productId: string, quantity: number) => {
			update((items) => {
				const item = items.find((item) => item.productId === productId);
				if (item) {
					item.quantity = quantity;
				}
				return items;
			});
		},
		clear: () => set([])
	};
}

export const cart = createCartStore();
