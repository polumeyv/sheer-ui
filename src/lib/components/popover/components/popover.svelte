<script lang="ts">
	import { boxWith } from "$lib/internal/toolbelt.js";
	import type { PopoverRootProps } from "../types.js";
	import { PopoverRootState } from "../popover.svelte.js";
	import FloatingLayer from "$lib/components/utilities/floating-layer/components/floating-layer.svelte";

	let {
		open = $bindable(false),
		onOpenChange = () => {},
		onOpenChangeComplete = () => {},
		children,
	}: PopoverRootProps = $props();

	PopoverRootState.create({
		open: boxWith(
			() => open,
			(v) => {
				open = v;
				onOpenChange(v);
			}
		),
		onOpenChangeComplete: boxWith(() => onOpenChangeComplete),
	});
</script>

<FloatingLayer>
	{@render children?.()}
</FloatingLayer>
