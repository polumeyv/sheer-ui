<script lang="ts" module>
	// CheckboxNative: the form checkbox. A real <input type=checkbox> that submits
	// (name/value) and supports bind:checked / bind:indeterminate. For controlled,
	// headless, or grouped use (table select-all, Checkbox.Group) use `../checkbox`.
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import CheckIcon from '@lucide/svelte/icons/check';
	import MinusIcon from '@lucide/svelte/icons/minus';

	export type CheckboxProps = Omit<HTMLAttributes<HTMLSpanElement>, 'class'> & {
		ref?: HTMLInputElement | null;
		id?: string;
		class?: string | null;
		checked?: boolean;
		indeterminate?: boolean;
		disabled?: boolean | null;
		required?: boolean;
		readonly?: boolean | null;
		name?: string;
		value?: string;
		onCheckedChange?: (checked: boolean) => void;
		onIndeterminateChange?: (indeterminate: boolean) => void;
	};
</script>

<script lang="ts">
	let {
		ref = $bindable(null),
		id,
		class: className,
		checked = $bindable(false),
		indeterminate = $bindable(false),
		disabled = false,
		required = false,
		readonly = false,
		name = undefined,
		value = 'on',
		onCheckedChange,
		onIndeterminateChange,
		...restProps
	}: CheckboxProps = $props();

	// A real <input type="checkbox"> is the interactive, focusable, form-participating element
	// (focus lands on it, so the box's focus-within ring is correct), overlaid invisibly on the
	// styled box + indicator icon. Mirrors the data-state semantics of the headless checkbox:
	// indeterminate wins, then checked, then unchecked.
	const state = $derived(indeterminate ? 'indeterminate' : checked ? 'checked' : 'unchecked');

	const shared = $derived({
		'data-disabled': disabled ? '' : undefined,
		'data-readonly': readonly ? '' : undefined,
		'data-state': state,
		'data-required': required ? '' : undefined,
	});
</script>

<span
	data-slot="checkbox"
	{...shared}
	{...restProps}
	class={cn(
		'border-border dark:bg-border/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-within:border-ring focus-within:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive relative grid size-4 shrink-0 place-items-center rounded-[4px] border shadow-xs transition-shadow outline-none focus-within:ring-[3px] data-disabled:cursor-not-allowed data-disabled:opacity-50',
		className,
	)}>
	<input
		bind:this={ref}
		bind:checked
		bind:indeterminate
		type="checkbox"
		data-slot="checkbox-input"
		{...shared}
		{id}
		{name}
		{value}
		{disabled}
		{required}
		aria-required={required ? 'true' : 'false'}
		aria-readonly={readonly ? 'true' : undefined}
		onclick={(e) => {
			if (readonly) e.preventDefault();
		}}
		onchange={() => {
			onCheckedChange?.(checked);
			onIndeterminateChange?.(indeterminate);
		}}
		class="peer absolute inset-0 z-10 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed" />

	<div data-slot="checkbox-indicator" class="pointer-events-none text-current transition-none">
		{#if indeterminate}
			<MinusIcon class="size-3.5" />
		{:else if checked}
			<CheckIcon class="size-3.5" />
		{/if}
	</div>
</span>
