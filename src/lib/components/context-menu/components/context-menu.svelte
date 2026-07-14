<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import type { ContextMenuRootProps } from '../types.js';
	import FloatingLayer from '../../../internal/floating-layer/components/floating-layer.svelte';
	import { MenuMenuState, MenuRootState } from '../../menu/menu.svelte.js';

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

<svelte:document
	onkeydowncapture={() => (root.isKeyboard = true)}
	onpointerdowncapture={() => (root.isKeyboard = false)}
/>

<FloatingLayer>
	{@render children?.()}
</FloatingLayer>
