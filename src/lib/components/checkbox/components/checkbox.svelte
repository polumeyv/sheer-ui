<script lang="ts">
	import { boxWith, mergeProps } from '$lib/internal/toolbelt.js';
	import type { CheckboxRootProps } from '../types.js';
	import { getCheckboxGroupOr, CheckboxRootState } from '../checkbox.svelte.js';
	import CheckboxInput from './checkbox-input.svelte';
	import { createId } from '$lib/internal/create-id.js';
	import { watch } from '$lib/internal/toolbelt.js';
	import CheckIcon from '@lucide/svelte/icons/check';
	import MinusIcon from '@lucide/svelte/icons/minus';

	const uid = $props.id();

	let {
		checked = $bindable(false),
		ref = $bindable(null),
		onCheckedChange,
		children,
		disabled = false,
		required = false,
		name = undefined,
		value = 'on',
		id = createId(uid),
		indeterminate = $bindable(false),
		onIndeterminateChange,
		child,
		type = 'button',
		readonly,
		...restProps
	}: CheckboxRootProps = $props();

	const group = getCheckboxGroupOr(null);

	function syncCheckedFromGroupValue() {
		if (!group || !value) return;
		checked = group.opts.value.current.includes(value);
	}

	// Initial setup: grouped checkboxes derive their checked state from the group value.
	syncCheckedFromGroupValue();

	watch.pre(
		() => value,
		() => {
			/**
			 * Dynamic item values are supported: when a checkbox changes which group
			 * value it represents, checked must be repaired from the current group value.
			 */
			syncCheckedFromGroupValue();
		},
	);

	const rootState = CheckboxRootState.create(
		{
			checked: boxWith(
				() => checked,
				(v) => {
					checked = v;
					onCheckedChange?.(v);
				},
			),
			disabled: boxWith(() => disabled ?? false),
			required: boxWith(() => required),
			name: boxWith(() => name),
			value: boxWith(() => value),
			id: boxWith(() => id),
			ref: boxWith(
				() => ref,
				(v) => (ref = v),
			),
			indeterminate: boxWith(
				() => indeterminate,
				(v) => {
					indeterminate = v;
					onIndeterminateChange?.(v);
				},
			),
			type: boxWith(() => type),
			readonly: boxWith(() => Boolean(readonly)),
		},
		group,
	);

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'checkbox',
				class:
					'border-border dark:bg-border/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive peer flex size-4 shrink-0 items-center justify-center rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
			},
			restProps,
			rootState.props,
		),
	);
</script>

{#if child}
	{@render child({
		props: mergedProps,
		...rootState.snippetProps,
	})}
{:else}
	<button {...mergedProps}>
		<div data-slot="checkbox-indicator" class="text-current transition-none">
			{#if checked}
				<CheckIcon class="size-3.5" />
			{:else if indeterminate}
				<MinusIcon class="size-3.5" />
			{/if}
		</div>
	</button>
{/if}

<CheckboxInput />
