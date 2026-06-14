<script lang="ts">
		import type { ContextMenuRootProps } from "$lib/components/primitive/context-menu/index";
	import FloatingLayer from "$lib/components/_shared/utilities/floating-layer/components/floating-layer.svelte";
	import { MenuMenuState } from "$lib/components/_shared/menu/menu.svelte";
	import { MenuRootState } from "$lib/components/_shared/menu/root.svelte";

	let {
		open = $bindable(false),
		dir = "ltr",
		// debugMode = false,
		onOpenChange = (() => {}),
		onOpenChangeComplete = (() => {}),
		children,
	}: ContextMenuRootProps = $props();

	const root = MenuRootState.create({
		variant: { get current() { return "context-menu" as const; } },
		dir: { get current() { return dir; } },
		onClose: () => {
			open = false;
			onOpenChange?.(false);
		},
	});

	MenuMenuState.create(
		{
			open: { get current() { return open; }, set current(v) { open = v; onOpenChange(v); } },
			onOpenChangeComplete: { get current() { return onOpenChangeComplete; } },
		},
		root
	);
</script>

<FloatingLayer>
	{@render children?.()}
</FloatingLayer>
