<script lang="ts">
	import type { User } from '$types';

	let { user }: { user?: User } = $props();
</script>

<header class="bg-white shadow">
	<nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between h-16">
			<div class="flex">
				<a href="/" class="flex items-center">
					<span class="text-2xl font-bold text-primary-600">Store</span>
				</a>
				<div class="hidden sm:ml-6 sm:flex sm:space-x-8">
					<a
						href="/products"
						class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary-600"
					>
						Products
					</a>
				</div>
			</div>
			<div class="flex items-center">
				{#if user}
					<span class="text-sm text-gray-700 mr-4">{user.email}</span>
					{#if user.role === 'ADMIN'}
						<a
							href="/admin"
							class="text-sm font-medium text-gray-700 hover:text-primary-600 mr-4"
						>
							Admin
						</a>
					{/if}
					<form method="POST" action="/auth/logout">
						<button
							type="submit"
							class="text-sm font-medium text-gray-700 hover:text-primary-600"
						>
							Logout
						</button>
					</form>
				{:else}
					<a
						href="/auth/login"
						class="text-sm font-medium text-gray-700 hover:text-primary-600"
					>
						Login
					</a>
				{/if}
			</div>
		</div>
	</nav>
</header>
