<script lang="ts">
	import { boxWith } from "$lib/vendor/toolbelt/index.js";
	import type { MenuRootProps } from "$lib/components/_shared/menu/index.js";
	import { MenuMenuState, MenuRootState } from "$lib/components/_shared/menu/menu.svelte.js";
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
		variant: boxWith(() => variant),
		dir: boxWith(() => dir),
		// debugMode: boxWith(() => debugMode),
		onClose: () => {
			open = false;
			onOpenChange(false);
		},
		shouldSkipExitAnimation: () => shouldSkipExitAnimation?.() ?? false,
	});

	MenuMenuState.create(
		{
			open: boxWith(
				() => open,
				(v) => {
					open = v;
					onOpenChange(v);
				}
			),
			onOpenChangeComplete: boxWith(() => onOpenChangeComplete),
		},
		root
	);
</script>

<FloatingLayer>
	{@render children?.()}
</FloatingLayer>
