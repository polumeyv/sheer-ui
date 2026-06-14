<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { ArrowProps } from "$lib/components/_shared/utilities/arrow/index";
	import { useId } from "$lib/vendor/use-id";

	let {
		id = useId(),
		children,
		child,
		width = 10,
		height = 5,
		...restProps
	}: ArrowProps = $props();

	const mergedProps = $derived(mergeProps(restProps, { id }));
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
