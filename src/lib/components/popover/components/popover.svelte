<script lang="ts">
	import type { PopoverRootProps } from '../types.js';
	import { PopoverRootState } from '../popover.svelte.js';
	import { boxWith } from '$lib/internal/tools/index.js';

	let {
		open = $bindable(false),
		onOpenChange = () => {},
		onOpenChangeComplete = () => {},
		children,
	}: PopoverRootProps = $props();

	PopoverRootState.create({
		open: boxWith(
			() => open,
			(value) => {
				open = value;
				onOpenChange(value);
			},
		),
		onOpenChangeComplete: boxWith(() => onOpenChangeComplete),
	});
</script>

{@render children?.()}
