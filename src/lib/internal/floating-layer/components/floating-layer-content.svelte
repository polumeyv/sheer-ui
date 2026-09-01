<script lang="ts">
	import { boxWith } from '../../tools/index.js';
	import { FloatingContentState } from '../use-floating-layer.svelte.js';
	import type { ContentImplProps } from './index.js';

	let {
		content,
		side = 'bottom',
		sideOffset = 0,
		align = 'center',
		alignOffset = 0,
		id,
		arrowPadding = 0,
		avoidCollisions = true,
		collisionPadding = 0,
		hideWhenDetached = false,
		onPlaced = () => {},
		dir = 'ltr',
		style = {},
		customAnchor = null,
		enabled,
		present,
		tooltip = false,
	}: ContentImplProps = $props();

	const contentState = FloatingContentState.create(
		{
			side: boxWith(() => side),
			sideOffset: boxWith(() => sideOffset),
			align: boxWith(() => align),
			alignOffset: boxWith(() => alignOffset),
			id: boxWith(() => id),
			arrowPadding: boxWith(() => arrowPadding),
			avoidCollisions: boxWith(() => avoidCollisions),
			collisionPadding: boxWith(() => collisionPadding),
			hideWhenDetached: boxWith(() => hideWhenDetached),
			onPlaced: boxWith(() => onPlaced),
			dir: boxWith(() => dir),
			style: boxWith(() => style),
			enabled: boxWith(() => enabled),
			present: boxWith(() => present ?? enabled),
			customAnchor: boxWith(() => customAnchor),
		},
		tooltip,
	);
</script>

<!-- a virtual anchor precedes the content, as CSS anchor resolution requires -->
{#if contentState.virtualAnchorStyle}
	<span style={contentState.virtualAnchorStyle}></span>
{/if}
{@render content?.({ props: contentState.props })}
