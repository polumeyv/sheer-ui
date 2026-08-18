<script lang="ts">
	import { LinkPreview } from '#lib/components/link-preview/index.js';

	let { openDelay = 700, closeDelay = 300 }: { openDelay?: number; closeDelay?: number } = $props();
</script>

<LinkPreview.Root {openDelay} {closeDelay}>
	{#snippet children(preview)}
		<output data-testid="open">{preview.open ? 'open' : 'closed'}</output>
		<LinkPreview.Trigger data-testid="trigger">Trigger</LinkPreview.Trigger>
	{/snippet}
</LinkPreview.Root>
