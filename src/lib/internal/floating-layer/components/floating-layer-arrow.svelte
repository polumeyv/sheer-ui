<script lang="ts">
	import { boxWith } from '../../tools/index.js';
	import { mergeProps } from '../../merge-props.js';
	import { FloatingArrowState } from '../use-floating-layer.svelte.js';
	import type { FloatingLayerArrowProps } from '../types.js';
	import { useId } from '../../use-id.js';

	let { id = useId(), ref = $bindable(null), children, child, width = 10, height = 5, ...restProps }: FloatingLayerArrowProps = $props();

	const arrowState = FloatingArrowState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	const mergedProps = $derived(mergeProps(restProps, arrowState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>
		{#if children}
			{@render children?.()}
		{:else}
			<svg {width} {height} viewBox="0 0 30 10" preserveAspectRatio="none" data-arrow="">
				<polygon points="0,0 30,0 15,10" fill="currentColor" />
			</svg>
		{/if}
	</span>
{/if}
