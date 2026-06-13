<script lang="ts">
	import { boxWith } from "$lib/vendor/toolbelt/index.js";
	import type { PopoverRootProps } from "$lib/components/popover/primitive/index.js";
	import { PopoverRootState } from "$lib/components/popover/primitive/popover.svelte.js";
	import FloatingLayer from "$lib/components/_shared/utilities/floating-layer/components/floating-layer.svelte";

	let {
		open = $bindable(false),
		onOpenChange = (() => {}),
		onOpenChangeComplete = (() => {}),
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
