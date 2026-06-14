<script lang="ts">
		import type { MenuSubProps } from "$lib/components/_shared/menu/index";
	import { MenuSubmenuState } from "$lib/components/_shared/menu/menu.svelte";
	import FloatingLayer from "$lib/components/_shared/utilities/floating-layer/components/floating-layer.svelte";

	let {
		open = $bindable(false),
		onOpenChange = (() => {}),
		onOpenChangeComplete = (() => {}),
		children,
	}: MenuSubProps = $props();

	MenuSubmenuState.create({
		open: { get current() { return open; }, set current(v) { open = v; onOpenChange?.(v); } },
		onOpenChangeComplete: { get current() { return onOpenChangeComplete; } },
	});
</script>

<FloatingLayer>
	{@render children?.()}
</FloatingLayer>
