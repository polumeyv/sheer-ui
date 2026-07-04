<script lang="ts">
	import * as ScrollArea from '../components/scroll-area/index.js';
	import { Separator } from '../components/separator/index.js';

	const tags = Array.from({ length: 50 }, (_, i) => `v1.2.0-beta.${50 - i}`);
</script>

<ScrollArea.Root class="h-72 w-48 rounded-md border">
	<div class="p-4">
		<h4 class="mb-4 text-sm leading-none font-medium">Tags</h4>
		{#each tags as tag (tag)}
			<div class="text-sm">{tag}</div>
			<Separator class="my-2" />
		{/each}
	</div>
</ScrollArea.Root>
