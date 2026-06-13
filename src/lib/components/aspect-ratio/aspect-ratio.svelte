<script lang="ts">
	import { mergeProps } from '$lib/vendor/index.js';
	import type { AspectRatioRootProps } from '$lib/components/aspect-ratio/primitive/index.js';
	import { AspectRatioRootState } from '$lib/components/aspect-ratio/primitive/aspect-ratio.svelte.js';
	import { createId } from '$lib/internal/create-id.js';

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		ratio = 1,
		children,
		child,
		...restProps
	}: AspectRatioRootProps = $props();

	const rootState = AspectRatioRootState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		ratio: { get current() { return ratio; } },
	});

	const mergedProps = $derived(
		mergeProps({ 'data-slot': 'aspect-ratio' }, restProps, rootState.props)
	);
</script>

<div style:position="relative" style:width="100%" style:padding-bottom="{ratio ? 100 / ratio : 0}%">
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
</div>
