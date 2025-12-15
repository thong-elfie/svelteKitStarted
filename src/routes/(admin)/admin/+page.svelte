<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Admin Dashboard</title>
</svelte:head>

<div>
	<h1 class="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
	
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
		<div class="bg-white rounded-lg shadow p-6">
			<h3 class="text-sm font-medium text-gray-500 mb-2">Total Orders</h3>
			<p class="text-3xl font-bold text-gray-900">0</p>
		</div>
		<div class="bg-white rounded-lg shadow p-6">
			<h3 class="text-sm font-medium text-gray-500 mb-2">Total Revenue</h3>
			<p class="text-3xl font-bold text-gray-900">$0.00</p>
		</div>
		<div class="bg-white rounded-lg shadow p-6">
			<h3 class="text-sm font-medium text-gray-500 mb-2">Total Products</h3>
			<p class="text-3xl font-bold text-gray-900">0</p>
		</div>
	</div>

	<div class="bg-white rounded-lg shadow">
		<div class="px-6 py-4 border-b border-gray-200">
			<h2 class="text-lg font-semibold text-gray-900">Recent Orders</h2>
		</div>
		<div class="p-6">
			<p class="text-gray-500 text-center py-8">No orders yet</p>
		</div>
	</div>
</div>
