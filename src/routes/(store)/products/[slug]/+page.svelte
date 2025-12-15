<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.product.name}</title>
	<meta name="description" content={data.product.description || ''} />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
		<div class="aspect-square bg-gray-200 rounded-lg overflow-hidden">
			{#if data.product.image}
				<img src={data.product.image} alt={data.product.name} class="w-full h-full object-cover" />
			{/if}
		</div>
		<div>
			<h1 class="text-3xl font-bold text-gray-900 mb-4">{data.product.name}</h1>
			<p class="text-2xl font-semibold text-primary-600 mb-6">
				${(data.product.price / 100).toFixed(2)}
			</p>
			{#if data.product.description}
				<p class="text-gray-700 mb-6">{data.product.description}</p>
			{/if}
			<div class="mb-6">
				<span class="text-sm text-gray-600">
					{data.product.stock > 0 ? `${data.product.stock} in stock` : 'Out of stock'}
				</span>
			</div>
			<button
				class="w-full bg-primary-600 text-white py-3 px-6 rounded-md hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
				disabled={data.product.stock === 0}
			>
				Add to Cart
			</button>
		</div>
	</div>
</div>
