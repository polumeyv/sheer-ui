<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import type { MenuSubProps } from '../types.js';
	import { MenuSubmenuState } from '../menu.svelte.js';
	import FloatingLayer from '$lib/components/utilities/floating-layer/components/floating-layer.svelte';

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
