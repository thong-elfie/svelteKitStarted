<script lang="ts">
	import type { User } from '$types';

	let { user }: { user: User } = $props();
</script>

<aside class="w-64 bg-gray-900 text-white">
	<div class="p-6">
		<h2 class="text-2xl font-bold">Admin</h2>
	</div>
	<nav class="mt-6">
		<a
			href="/admin"
			class="block px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
		>
			Dashboard
		</a>
		<a
			href="/admin/orders"
			class="block px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
		>
			Orders
		</a>
		<a
			href="/admin/products"
			class="block px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
		>
			Products
		</a>
	</nav>
	<div class="absolute bottom-0 w-64 p-6 border-t border-gray-800">
		<p class="text-sm text-gray-400">{user.email}</p>
		<form method="POST" action="/auth/logout" class="mt-2">
			<button
				type="submit"
				class="text-sm text-gray-400 hover:text-white transition-colors"
			>
				Logout
			</button>
		</form>
	</div>
</aside>
