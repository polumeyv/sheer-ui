<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/index.js';
	import { SeparatorRootState } from '$lib/components/separator/primitive/separator.svelte.js';
	import type { SeparatorRootProps } from '$lib/components/separator/primitive/index.js';
	import { createId } from '$lib/internal/create-id.js';
	import { cn } from '../../vendor/utils';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		children,
		decorative = false,
		orientation = 'horizontal',
		class: className,
		'data-slot': dataSlot = 'separator',
		...restProps
	}: SeparatorRootProps = $props();

	const rootState = SeparatorRootState.create({
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		id: boxWith(() => id),
		decorative: boxWith(() => decorative),
		orientation: boxWith(() => orientation),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': dataSlot,
				class: cn(
					"bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
					className
				),
			},
			restProps,
			rootState.props
		)
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
