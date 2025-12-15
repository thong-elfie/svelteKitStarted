<script lang="ts">
	import AdminSidebar from '$components/layout/AdminSidebar.svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();
</script>

<div class="flex h-screen bg-gray-100">
	<AdminSidebar user={data.user} />
	<main class="flex-1 overflow-y-auto">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{@render children()}
		</div>
	</main>
</div>
