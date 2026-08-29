<script lang="ts">
	// Checkbox (button): controlled / headless. A <button role=checkbox> for table
	// select-all, JS-owned state, and Checkbox.Group. It does NOT submit in a form;
	// use `CheckboxNative` (name/value) for form fields.
	import { bindableWith, boxWith, repairBindable } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { CheckboxRootProps } from '../types.js';
	import { CheckboxRootState } from '../checkbox.svelte.js';
	import { createId } from '../../../internal/create-id.js';
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
		value = 'on',
		id = createId(uid),
		indeterminate = $bindable(false),
		onIndeterminateChange,
		child,
		type = 'button',
		readonly,
		...restProps
	}: CheckboxRootProps = $props();

	const rootState = CheckboxRootState.create({
		checked: bindableWith(
			() => checked,
			(v) => (checked = v),
			(v) => onCheckedChange?.(v),
		),
		disabled: boxWith(() => disabled ?? false),
		required: boxWith(() => required),
		value: boxWith(() => value),
		id: boxWith(() => id),
		ref: bindableWith(
			() => ref,
			(v) => (ref = v),
		),
		indeterminate: bindableWith(
			() => indeterminate,
			(v) => (indeterminate = v),
			(v) => onIndeterminateChange?.(v),
		),
		type: boxWith(() => type),
		readonly: boxWith(() => Boolean(readonly)),
	});

	repairBindable(rootState.groupChecked, () => (checked = rootState.groupChecked() ?? checked));

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'checkbox',
				class:
					'border-border dark:bg-border/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive peer grid size-4 shrink-0 place-items-center rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50',
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
