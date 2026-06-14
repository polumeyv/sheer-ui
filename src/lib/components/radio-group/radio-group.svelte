<script lang="ts">
	import { mergeProps } from '$lib/vendor';
	import type { RadioGroupRootProps } from '$lib/components/radio-group/primitive/index';
	import { RadioGroupRootState } from '$lib/components/radio-group/primitive/radio-group.svelte';
	import RadioGroupInput from '$lib/components/radio-group/primitive/components/radio-group-input.svelte';
	import { createId } from '$lib/vendor/create-id';
	import { cn } from '../../vendor/utils';

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
		onValueChange = () => {},
		class: className,
		...restProps
	}: RadioGroupRootProps = $props();

	const rootState = RadioGroupRootState.create({
		orientation: {
			get current() {
				return orientation;
			},
		},
		disabled: {
			get current() {
				return disabled;
			},
		},
		loop: {
			get current() {
				return loop;
			},
		},
		name: {
			get current() {
				return name;
			},
		},
		required: {
			get current() {
				return required;
			},
		},
		readonly: {
			get current() {
				return readonly;
			},
		},
		id: {
			get current() {
				return id;
			},
		},
		value: {
			get current() {
				return value;
			},
			set current(v) {
				if (v === value) return;
				value = v;
				onValueChange?.(v);
			},
		},
		ref: {
			get current() {
				return ref;
			},
			set current(v) {
				ref = v;
			},
		},
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'radio-group',
				class: cn('grid gap-3', className),
			},
			restProps,
			rootState.props,
		),
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
