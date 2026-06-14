<script lang="ts">
		import type { MenuRootProps } from "$lib/components/_shared/menu/index";
	import { MenuMenuState } from "$lib/components/_shared/menu/menu.svelte";
	import { MenuRootState } from "$lib/components/_shared/menu/root.svelte";
	import FloatingLayer from "$lib/components/_shared/utilities/floating-layer/components/floating-layer.svelte";

	let {
		open = $bindable(false),
		dir = "ltr",
		// debugMode = false,
		onOpenChange = (() => {}),
		onOpenChangeComplete = (() => {}),
		_internal_variant: variant = "dropdown-menu",
		_internal_should_skip_exit_animation: shouldSkipExitAnimation = undefined,
		children,
	}: MenuRootProps & {
		_internal_variant?: "context-menu" | "dropdown-menu" | "menubar";
		_internal_should_skip_exit_animation?: () => boolean;
	} = $props();

	const root = MenuRootState.create({
		variant: { get current() { return variant; } },
		dir: { get current() { return dir; } },
		onClose: () => {
			open = false;
			onOpenChange(false);
		},
		shouldSkipExitAnimation: () => shouldSkipExitAnimation?.() ?? false,
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
