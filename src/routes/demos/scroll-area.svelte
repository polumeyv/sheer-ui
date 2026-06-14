<script lang="ts">
	import * as ScrollArea from '$lib/components/scroll-area/index';
	import { Separator } from '$lib/components/separator/index';

	const tags = Array.from({ length: 50 }, (_, i) => `v1.2.0-beta.${i + 1}`);
</script>

<ScrollArea.Root class="h-72 w-full max-w-xs rounded-md border">
	<div class="p-4">
		<h4 class="mb-4 text-sm font-medium leading-none">Tags</h4>
		{#each tags as tag (tag)}
			<div class="text-sm">{tag}</div>
			<Separator class="my-2" />
		{/each}
	</div>
</ScrollArea.Root>
