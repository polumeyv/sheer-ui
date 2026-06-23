<script lang="ts">
	import type { PopoverRootProps } from '../types.js';
	import { PopoverRootState } from '../popover.svelte.js';

	import FloatingLayer from '../../utilities/floating-layer/components/floating-layer.svelte';

	import { boxWith } from '$lib/internal/tools/index.js';

	let {
		open = $bindable(false),
		onOpenChange = () => {},
		onOpenChangeComplete = () => {},
		children,
		...restProps
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

<FloatingLayer {...restProps}>
	{@render children?.()}
</FloatingLayer>
