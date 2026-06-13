<script lang="ts">
	import { boxWith } from "$lib/vendor/index.js";
	import type { ContextMenuRootProps } from "$lib/components/context-menu/primitive/index.js";
	import FloatingLayer from "$lib/components/_shared/utilities/floating-layer/components/floating-layer.svelte";
	import { MenuMenuState, MenuRootState } from "$lib/components/_shared/menu/menu.svelte.js";

	let {
		open = $bindable(false),
		dir = "ltr",
		// debugMode = false,
		onOpenChange = (() => {}),
		onOpenChangeComplete = (() => {}),
		children,
	}: ContextMenuRootProps = $props();

	const root = MenuRootState.create({
		variant: boxWith(() => "context-menu" as const),
		dir: boxWith(() => dir),
		// debugMode: boxWith(() => debugMode),
		onClose: () => {
			open = false;
			onOpenChange?.(false);
		},
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
