<script lang="ts">
	import { boxWith } from '$lib/internal/toolbelt.js';
	import type { ContextMenuRootProps } from '../types.js';
	import FloatingLayer from '$lib/components/utilities/floating-layer/components/floating-layer.svelte';
	import { MenuMenuState, MenuRootState } from '$lib/components/menu/menu.svelte.js';

	let {
		open = $bindable(false),
		dir = 'ltr',
		// debugMode = false,
		onOpenChange = () => {},
		onOpenChangeComplete = () => {},
		children,
	}: ContextMenuRootProps = $props();

	const root = MenuRootState.create({
		variant: boxWith(() => 'context-menu' as const),
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
				},
			),
			onOpenChangeComplete: boxWith(() => onOpenChangeComplete),
		},
		root,
	);
</script>

<FloatingLayer>
	{@render children?.()}
</FloatingLayer>
