<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatDate(date: Date) {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function formatPrice(price: number) {
		return `$${(price / 100).toFixed(2)}`;
	}
</script>

<svelte:head>
	<title>Orders - Admin</title>
</svelte:head>

<div>
	<h1 class="text-3xl font-bold text-gray-900 mb-8">Orders</h1>

	<div class="bg-white rounded-lg shadow overflow-hidden">
		<table class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
				<tr>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Order ID
					</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Customer
					</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Total
					</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Status
					</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Date
					</th>
				</tr>
			</thead>
			<tbody class="bg-white divide-y divide-gray-200">
				{#each data.orders as order}
					<tr>
						<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
							{order.id.slice(0, 8)}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
							{order.shippingName}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
							{formatPrice(order.total)}
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
								{order.status}
							</span>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
							{formatDate(order.createdAt)}
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="5" class="px-6 py-8 text-center text-gray-500">
							No orders found
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
