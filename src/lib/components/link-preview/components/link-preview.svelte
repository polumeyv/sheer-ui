<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import type { LinkPreviewRootProps } from '../types.js';
	import { LinkPreviewRootState } from '../link-preview.svelte.js';

	let {
		disabled = false,
		open = $bindable(false),
		onOpenChange = () => {},
		onOpenChangeComplete = () => {},
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
			},
		),
		openDelay: boxWith(() => openDelay),
		closeDelay: boxWith(() => closeDelay),
		onOpenChangeComplete: boxWith(() => onOpenChangeComplete),
	});
</script>

{@render children?.()}
