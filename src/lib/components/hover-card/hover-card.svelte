<script lang="ts">
	import { boxWith } from '$lib/vendor/toolbelt/index.js';
	import type { LinkPreviewRootProps } from '$lib/bits/link-preview/types.js';
	import { LinkPreviewRootState } from '$lib/bits/link-preview/link-preview.svelte.js';
	import { noop } from '$lib/internal/noop.js';
	import { FloatingLayer } from '$lib/bits/utilities/floating-layer/index.js';

	let {
		disabled = false,
		open = $bindable(false),
		onOpenChange = noop,
		onOpenChangeComplete = noop,
		openDelay = 700,
		closeDelay = 300,
		children,
	}: LinkPreviewRootProps = $props();

	LinkPreviewRootState.create({
		disabled: boxWith(() => disabled),
		open: boxWith(
			() => open,
			(v) => {
				open = v;
				onOpenChange(v);
			}
		),
		openDelay: boxWith(() => openDelay),
		closeDelay: boxWith(() => closeDelay),
		onOpenChangeComplete: boxWith(() => onOpenChangeComplete),
	});
</script>

<FloatingLayer.Root>
	{@render children?.()}
</FloatingLayer.Root>
