<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import { onMount } from 'svelte';
	import type { ScrollAreaThumbProps } from '../types.js';
	import { ScrollAreaThumbImplState } from '../scroll-area.svelte.js';

	let {
		ref = $bindable(null),
		id,
		child,
		children,
		present,
		...restProps
	}: Omit<ScrollAreaThumbProps, 'forceMount' | 'id'> & {
		id: string;
		present: boolean;
	} = $props();

	let isMounted = $state(false);
	onMount(() => {
		isMounted = true;
	});

	const thumbState = ScrollAreaThumbImplState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		mounted: boxWith(() => isMounted),
	});

	const mergedProps = $derived(
		mergeProps(restProps, thumbState.props, {
			style: {
				hidden: !present,
			},
		}),
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
