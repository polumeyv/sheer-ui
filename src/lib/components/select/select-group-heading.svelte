<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { SelectGroupHeadingProps } from '$lib/bits/select/types.js';
	import { SelectGroupHeadingState } from '$lib/bits/select/select.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { cn } from '../../utils';

	const uid = $props.id();
	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		children,
		class: className,
		...restProps
	}: SelectGroupHeadingProps = $props();

	const groupHeadingState = SelectGroupHeadingState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'select-group-heading',
				class: cn('text-muted-foreground px-2 py-1.5 text-xs', className),
			},
			restProps,
			groupHeadingState.props
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
