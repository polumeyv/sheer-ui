<script lang="ts">
	import { boxWith } from "$lib/vendor/toolbelt/index.js";
	import type { MenuSubProps } from "$lib/components/_shared/menu/types.js";
	import { MenuSubmenuState } from "$lib/components/_shared/menu/menu.svelte.js";
	import FloatingLayer from "$lib/components/_shared/utilities/floating-layer/components/floating-layer.svelte";
	import { noop } from "$lib/internal/noop.js";

	let {
		open = $bindable(false),
		onOpenChange = noop,
		onOpenChangeComplete = noop,
		children,
	}: MenuSubProps = $props();

	MenuSubmenuState.create({
		open: boxWith(
			() => open,
			(v) => {
				open = v;
				onOpenChange?.(v);
			}
		),
		onOpenChangeComplete: boxWith(() => onOpenChangeComplete),
	});
</script>

<FloatingLayer>
	{@render children?.()}
</FloatingLayer>
