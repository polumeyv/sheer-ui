<script lang="ts">
	import { boxWith } from "$lib/vendor/index.js";
	import type { MenuSubProps } from "$lib/components/_shared/menu/index.js";
	import { MenuSubmenuState } from "$lib/components/_shared/menu/menu.svelte.js";
	import FloatingLayer from "$lib/components/_shared/utilities/floating-layer/components/floating-layer.svelte";

	let {
		open = $bindable(false),
		onOpenChange = (() => {}),
		onOpenChangeComplete = (() => {}),
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
