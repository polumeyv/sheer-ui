<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { RadioGroupRootProps } from '$lib/bits/radio-group/types.js';
	import { RadioGroupRootState } from '$lib/bits/radio-group/radio-group.svelte.js';
	import RadioGroupInput from '$lib/bits/radio-group/components/radio-group-input.svelte';
	import { createId } from '$lib/internal/create-id.js';
	import { noop } from '$lib/internal/noop.js';
	import { cn } from '../../utils.js';

	const uid = $props.id();

	let {
		disabled = false,
		children,
		child,
		value = $bindable(''),
		ref = $bindable(null),
		orientation = 'vertical',
		loop = true,
		name = undefined,
		required = false,
		readonly = false,
		id = createId(uid),
		onValueChange = noop,
		class: className,
		...restProps
	}: RadioGroupRootProps = $props();

	const rootState = RadioGroupRootState.create({
		orientation: boxWith(() => orientation),
		disabled: boxWith(() => disabled),
		loop: boxWith(() => loop),
		name: boxWith(() => name),
		required: boxWith(() => required),
		readonly: boxWith(() => readonly),
		id: boxWith(() => id),
		value: boxWith(
			() => value,
			(v) => {
				if (v === value) return;
				value = v;
				onValueChange?.(v);
			}
		),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'radio-group',
				class: cn('grid gap-3', className),
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

<RadioGroupInput />
