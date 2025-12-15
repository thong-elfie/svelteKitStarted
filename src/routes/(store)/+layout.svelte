<script lang="ts">
	import StoreHeader from '$components/layout/StoreHeader.svelte';
	import Footer from '$components/layout/Footer.svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();
</script>

<div class="min-h-screen flex flex-col">
	<StoreHeader user={data.user} />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
