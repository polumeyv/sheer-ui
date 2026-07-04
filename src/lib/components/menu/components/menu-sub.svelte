<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import type { MenuSubProps } from '../types.js';
	import { MenuSubmenuState } from '../menu.svelte.js';
	import FloatingLayer from '../../../components/utilities/floating-layer/components/floating-layer.svelte';

	let { open = $bindable(false), onOpenChange = () => {}, onOpenChangeComplete = () => {}, children }: MenuSubProps = $props();

	MenuSubmenuState.create({
		open: boxWith(
			() => open,
			(v) => {
				open = v;
				onOpenChange?.(v);
			},
		),
		onOpenChangeComplete: boxWith(() => onOpenChangeComplete),
	});
</script>

<FloatingLayer>
	{@render children?.()}
</FloatingLayer>
