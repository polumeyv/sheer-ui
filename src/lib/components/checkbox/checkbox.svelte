<script lang="ts">import { untrack } from "svelte";
	import { mergeProps } from '$lib/vendor/index';
	import type { CheckboxRootProps } from '$lib/components/checkbox/primitive/index';
	import { getCheckboxGroupContextOr, CheckboxRootState } from '$lib/components/checkbox/primitive/checkbox.svelte';
	import CheckboxInput from '$lib/components/checkbox/primitive/components/checkbox-input.svelte';
	import { createId } from '$lib/vendor/create-id';
	import CheckIcon from '@lucide/svelte/icons/check';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import { cn, type WithoutChildrenOrChild } from '../../vendor/utils';

	const uid = $props.id();

	let {
		checked = $bindable(false),
		ref = $bindable(null),
		onCheckedChange,
		disabled = false,
		required = false,
		name = undefined,
		value = 'on',
		id = createId(uid),
		indeterminate = $bindable(false),
		onIndeterminateChange,
		type = 'button',
		readonly,
		class: className,
		...restProps
	}: WithoutChildrenOrChild<CheckboxRootProps> = $props();

	const group = getCheckboxGroupContextOr(null);

	if (group && value) {
		if (group.opts.value.current.includes(value)) {
			checked = true;
		} else {
			checked = false;
		}
	}

	$effect.pre(() => {
		void (value);
		untrack(() => {
			if (group && value) {
				if (group.opts.value.current.includes(value)) {
					checked = true;
				} else {
					checked = false;
				}
			}
		});
	});

	const rootState = CheckboxRootState.create(
		{
			checked: { get current() { return checked; }, set current(v) { checked = v; onCheckedChange?.(v); } },
			disabled: { get current() { return disabled ?? false; } },
			required: { get current() { return required; } },
			name: { get current() { return name; } },
			value: { get current() { return value; } },
			id: { get current() { return id; } },
			ref: { get current() { return ref; }, set current(v) { (ref = v); } },
			indeterminate: { get current() { return indeterminate; }, set current(v) { indeterminate = v; onIndeterminateChange?.(v); } },
			type: { get current() { return type; } },
			readonly: { get current() { return Boolean(readonly); } },
		},
		group
	);

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'checkbox',
				class: cn(
					'border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive peer flex size-4 shrink-0 items-center justify-center rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
					className,
				),
			},
			{ ...restProps },
			rootState.props,
		),
	);
</script>

<button {...mergedProps}>
	<div data-slot="checkbox-indicator" class="text-current transition-none">
		{#if checked}
			<CheckIcon class="size-3.5" />
		{:else if indeterminate}
			<MinusIcon class="size-3.5" />
		{/if}
	</div>
</button>

<CheckboxInput />
