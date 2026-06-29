<script lang="ts" module>
	import { cn } from '$lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type RadioGroupOrientation = 'horizontal' | 'vertical';

	export type RadioGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'class'> & {
		ref?: HTMLDivElement | null;
		id?: string;
		class?: string | null;
		value?: string;
		name?: string;
		disabled?: boolean;
		readonly?: boolean;
		required?: boolean;
		orientation?: RadioGroupOrientation;
		onValueChange?: (value: string) => void;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { setRadioGroupContext } from './context.js';

	let {
		ref = $bindable(null),
		id,
		class: className,
		value = $bindable(''),
		name,
		disabled = false,
		readonly = false,
		required = false,
		orientation = 'vertical',
		onValueChange,
		children,
		...restProps
	}: RadioGroupProps = $props();

	const uid = $props.id();
	// Native radios must share a `name` to act as one group (the browser then handles
	// roving focus, arrow-key navigation, and single selection across the items, even
	// across component boundaries). When no form `name` is given, fall back to a stable
	// generated one so the grouping still works.
	const groupName = $derived(name ?? `radio-group-${uid}`);

	setRadioGroupContext({
		get name() {
			return groupName;
		},
		get value() {
			return value;
		},
		get disabled() {
			return disabled;
		},
		get readonly() {
			return readonly;
		},
		get required() {
			return required;
		},
		select(next) {
			if (disabled || readonly || next === value) return;
			value = next;
			onValueChange?.(next);
		},
	});
</script>

<div
	bind:this={ref}
	{id}
	role="radiogroup"
	data-slot="radio-group"
	aria-required={required ? 'true' : undefined}
	aria-disabled={disabled ? 'true' : undefined}
	aria-readonly={readonly ? 'true' : undefined}
	aria-orientation={orientation}
	data-disabled={disabled ? '' : undefined}
	data-readonly={readonly ? '' : undefined}
	data-orientation={orientation}
	{...restProps}
	class={cn('grid gap-3', className)}>
	{@render children?.()}
</div>
