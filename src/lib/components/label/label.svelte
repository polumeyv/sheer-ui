<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { LabelRootProps } from '$lib/components/label/primitive/index.js';
	import { LabelRootState } from '$lib/components/label/primitive/label.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { cn } from '../../vendor/utils';

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		for: forProp,
		class: className,
		...restProps
	}: LabelRootProps = $props();

	const rootState = LabelRootState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});
	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'label',
				class: cn(
					"flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
					className
				),
			},
			restProps,
			rootState.props,
			{ for: forProp }
		)
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<label {...mergedProps} for={forProp}>
		{@render children?.()}
	</label>
{/if}
