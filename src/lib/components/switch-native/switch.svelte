<script lang="ts" module>
	import { join } from 'overrule';
	import type { HTMLAttributes } from 'svelte/elements';

	export type SwitchProps = Omit<HTMLAttributes<HTMLSpanElement>, 'class'> & {
		ref?: HTMLInputElement | null;
		id?: string;
		class?: string | null;
		checked?: boolean;
		disabled?: boolean | null;
		required?: boolean;
		name?: string;
		value?: string;
		onCheckedChange?: (checked: boolean) => void;
	};
</script>

<script lang="ts">
	let {
		ref = $bindable(null),
		id,
		class: className,
		checked = $bindable(false),
		disabled = false,
		required = false,
		name = undefined,
		value = 'on',
		onCheckedChange,
		...restProps
	}: SwitchProps = $props();

	// Mirrors the native-checkbox switch: a real <input type="checkbox" role="switch"> is the
	// interactive, focusable, form-participating element (focus lands on it, so the track's
	// focus-within ring is correct), overlaid invisibly on the styled track + thumb.
	const shared = $derived({
		'data-disabled': disabled ? '' : undefined,
		'data-state': checked ? 'checked' : 'unchecked',
		'data-required': required ? '' : undefined,
	});
</script>

<span
	data-slot="switch"
	data-switch-root=""
	{...shared}
	{...restProps}
	class={join(
		// Sizing is driven by one variable: --switch-size is the track height; width is
		// 1.75x it, the thumb fills the height, and travel is 0.75x it (W - thumb). Override
		// --switch-size alone to rescale the whole control. See the thumb span below.
		'relative [--switch-size:1.15rem] data-[state=checked]:bg-primary data-[state=unchecked]:bg-border focus-within:border-ring focus-within:ring-ring/50 dark:data-[state=unchecked]:bg-border/80 inline-flex h-(--switch-size) w-[calc(var(--switch-size)*1.75)] shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-within:ring-[3px] data-disabled:cursor-not-allowed data-disabled:opacity-50',
		className,
	)}>
	<input
		bind:this={ref}
		bind:checked
		type="checkbox"
		role="switch"
		data-slot="switch-input"
		data-switch-input=""
		{...shared}
		{id}
		{name}
		{value}
		{disabled}
		{required}
		aria-required={required ? 'true' : 'false'}
		onchange={() => onCheckedChange?.(checked)}
		class="peer absolute inset-0 z-10 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed" />

	<span
		data-slot="switch-thumb"
		data-switch-thumb=""
		{...shared}
		class="bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-[calc(var(--switch-size)-2px)] rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(var(--switch-size)*0.75)] data-[state=unchecked]:translate-x-0"
	></span>
</span>
