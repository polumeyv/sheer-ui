<script lang="ts" module>
	import { join } from 'overrule';
	import type { HTMLAttributes } from 'svelte/elements';
	import CircleIcon from '@lucide/svelte/icons/circle';

	export type RadioGroupItemProps = Omit<HTMLAttributes<HTMLSpanElement>, 'class'> & {
		ref?: HTMLInputElement | null;
		id?: string;
		class?: string | null;
		value: string;
		disabled?: boolean | null;
	};
</script>

<script lang="ts">
	import { getRadioGroupContext } from './context.js';

	let { ref = $bindable(null), id, class: className, value, disabled = false, ...restProps }: RadioGroupItemProps = $props();

	const group = getRadioGroupContext();
	const checked = $derived(group.value === value);
	const isDisabled = $derived(Boolean(disabled) || group.disabled);

	// A real <input type="radio"> is the interactive, focusable, form-participating element
	// (focus lands on it, so the ring's focus-within is correct), overlaid invisibly on the
	// styled circle + dot. Sharing the group name makes the browser handle exclusivity and
	// keyboard navigation; the value is otherwise controlled, so readonly/disabled can revert.
	const shared = $derived({
		'data-state': checked ? 'checked' : 'unchecked',
		'data-disabled': isDisabled ? '' : undefined,
	});
</script>

<span
	data-slot="radio-group-item"
	{...shared}
	{...restProps}
	class={join(
		'border-border text-primary dark:bg-border/30 focus-within:border-ring focus-within:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive relative grid aspect-square size-4 shrink-0 place-items-center rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-within:ring-[3px] data-disabled:cursor-not-allowed data-disabled:opacity-50',
		className,
	)}>
	<input
		bind:this={ref}
		{id}
		type="radio"
		data-slot="radio-group-input"
		{...shared}
		name={group.name}
		{value}
		{checked}
		disabled={isDisabled}
		required={group.required}
		onchange={(e) => {
			if (group.readonly || isDisabled) {
				e.currentTarget.checked = checked;
				return;
			}
			group.select(value);
		}}
		class="peer absolute inset-0 z-10 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed" />

	<div data-slot="radio-group-indicator" class="pointer-events-none text-current">
		{#if checked}
			<CircleIcon class="fill-primary size-2" />
		{/if}
	</div>
</span>
