<script lang="ts">
	import { cn, type WithElementRef } from '../../utils';
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';

	let {
		ref = $bindable(null),
		value = $bindable<string>(),
		class: className,
		children,
		placeholder,
		...restProps
	}: WithElementRef<HTMLSelectAttributes> & { placeholder?: string } = $props();
</script>

<select
	bind:this={ref}
	bind:value
	data-slot="native-select"
	class={cn(
		'native-select',
		'flex w-fit items-center justify-between gap-2',
		'h-9 rounded-sm border border-input bg-transparent',
		'text-sm whitespace-nowrap shadow-xs',
		'outline-none select-none',
		'transition-[color,box-shadow]',
		'dark:bg-input/30 dark:hover:bg-input/50',
		'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
		'disabled:cursor-not-allowed disabled:opacity-50',
		className,
	)}
	{...restProps}>
	<button class="flex w-full items-center justify-between gap-2 px-3 py-2">
		<selectedcontent></selectedcontent>
		{#if placeholder}
			<span class="native-select-placeholder text-muted-foreground">{placeholder}</span>
		{/if}
		<ChevronDown class="size-4 shrink-0 opacity-50 text-muted-foreground pointer-events-none" />
	</button>

	{@render children?.()}
</select>

<style>
	/* Opt-in */
	:global(.native-select),
	:global(.native-select::picker(select)) {
		appearance: base-select;
	}

	/* Hide the default picker icon */
	:global(.native-select::picker-icon) {
		display: none;
	}

	/* Hide the native checkmark completely */
	:global(.native-select option::checkmark) {
		display: none;
	}

	/* Rotate chevron when open - ONLY the button's svg */
	:global(.native-select:open > button svg) {
		transform: rotate(180deg);
	}

	:global(.native-select > button svg) {
		transition: transform 0.2s ease;
	}

	/* Picker positioning & styling */
	:global(.native-select::picker(select)) {
		inset: unset;
		top: anchor(bottom);
		left: anchor(left);
		min-width: max(anchor-size(width), 8rem);
		margin-top: 0.25rem;

		border: 1px solid var(--border);
		border-radius: calc(var(--radius) - 2px);
		background: var(--popover);
		color: var(--popover-foreground);
		padding: 0.25rem;
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);

		opacity: 0;
		transform: translateY(-0.5rem);

		transition:
			opacity 0.15s ease,
			transform 0.15s ease,
			display 0.15s allow-discrete,
			overlay 0.15s allow-discrete;
	}

	:global(.native-select:open::picker(select)) {
		opacity: 1;
		transform: translateY(0);
	}

	@starting-style {
		:global(.native-select:open::picker(select)) {
			opacity: 0;
			transform: translateY(-0.5rem);
		}
	}

	/* Options base styles */
	:global(.native-select option) {
		position: relative;
		display: flex;
		width: 100%;
		align-items: center;
		gap: 0.5rem;
		padding-block: 0.375rem;
		padding-inline-start: 0.5rem;
		padding-inline-end: 2rem;
		border-radius: calc(var(--radius) - 4px);
		font-size: 0.875rem;
		line-height: 1.25rem;
		cursor: default;
		outline: none;
		user-select: none;
		background: transparent;
		color: inherit;
	}

	/* Default: checked option is highlighted */
	:global(.native-select option:checked) {
		background: var(--accent);
		color: var(--accent-foreground);
	}

	/* When hovering ANY option, remove highlight from checked (unless it's the one being hovered) */
	:global(.native-select:has(option:hover) option:checked:not(:hover)) {
		background: transparent;
		color: inherit;
	}

	/* Hovered option is always highlighted */
	:global(.native-select option:hover) {
		background: var(--accent);
		color: var(--accent-foreground);
	}

	/* Custom checkmark - hidden by default */
	:global(.native-select-checkmark) {
		position: absolute;
		right: 0.5rem;
		display: none;
		align-items: center;
		justify-content: center;
		width: 0.875rem;
		height: 0.875rem;
	}

	/* Show checkmark only when option is checked */
	:global(.native-select option:checked .native-select-checkmark) {
		display: flex;
	}

	/* Hide browser default selectedcontent text when no real option is selected */
	:global(.native-select:not(:has(option:checked:not([disabled]))) selectedcontent) {
		display: none;
	}

	/* Placeholder - hide when a real (non-disabled) option is selected */
	:global(.native-select:has(option:checked:not([disabled])) .native-select-placeholder) {
		display: none;
	}
</style>
