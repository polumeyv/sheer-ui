<script lang="ts">
	import { mergeProps } from "$lib/vendor/toolbelt/index.js";
	import type { ArrowProps } from "$lib/components/_shared/utilities/arrow/index.js";
	import { useId } from "$lib/internal/use-id.js";

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
