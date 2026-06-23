<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import { FloatingAnchorState } from '../use-floating-layer.svelte.js';
	import type { AnchorProps } from './index.js';
	import type { Measurable } from '$lib/internal/floating-svelte/types.js';

	let { id, children, virtualEl, ref, tooltip = false }: AnchorProps = $props();

	FloatingAnchorState.create(
		{
			id: boxWith(() => id),
			virtualEl: boxWith(() => virtualEl as unknown as Measurable | null),
			ref,
		},
		tooltip,
	);
</script>

{@render children?.()}
