<script lang="ts">
		import type { LinkPreviewRootProps } from '$lib/components/primitive/link-preview/index';
	import { LinkPreviewRootState } from '$lib/components/primitive/link-preview/link-preview.svelte.js';
	import { FloatingLayer } from '$lib/components/_shared/utilities/floating-layer/index';

	let {
		disabled = false,
		open = $bindable(false),
		onOpenChange = (() => {}),
		onOpenChangeComplete = (() => {}),
		openDelay = 700,
		closeDelay = 300,
		children,
	}: LinkPreviewRootProps = $props();

	LinkPreviewRootState.create({
		disabled: { get current() { return disabled; } },
		open: { get current() { return open; }, set current(v) { open = v; onOpenChange(v); } },
		openDelay: { get current() { return openDelay; } },
		closeDelay: { get current() { return closeDelay; } },
		onOpenChangeComplete: { get current() { return onOpenChangeComplete; } },
	});
</script>

<FloatingLayer.Root>
	{@render children?.()}
</FloatingLayer.Root>
