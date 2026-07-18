<script lang="ts">
	import { join } from 'overrule';
	import type { WithElementRef } from '../../internal/utils.js';
	import type { ClassValue, HTMLSelectAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';

	type SelectChangeEvent = Event & {
		currentTarget: EventTarget & HTMLSelectElement;
	};

	let {
		ref = $bindable<HTMLSelectElement | null>(null),
		value = $bindable(''),
		class: className,
		triggerClass,
		widthClass = 'w-fit',
		children,
		placeholder,
		icon,
		side = 'bottom',
		align = 'start',
		maxHeight,
		onchange,
		...restProps
	}: WithElementRef<HTMLSelectAttributes, HTMLSelectElement> & {
		/** Text shown in the trigger when no option is selected. */
		placeholder?: string;
		/** Classes applied to the inner trigger `<button>` (layout/alignment). */
		triggerClass?: ClassValue;
		/** Classes applied to the root select width. Defaults to `w-fit`. */
		widthClass?: ClassValue;
		/** Leading content rendered inside the trigger, before the selected value. */
		icon?: Snippet;
		/** Side the dropdown opens toward. */
		side?: 'top' | 'bottom';
		/** Horizontal alignment of the dropdown relative to the trigger. */
		align?: 'start' | 'center' | 'end';
		/** Caps the dropdown height (any CSS length, e.g. `'12.5rem'`); enables scrolling. */
		maxHeight?: string;
	} = $props();

	let selectedLabel = $state('');

	function syncSelectedLabel(select: HTMLSelectElement) {
		const option = select.selectedOptions[0];

		if (!option || option.disabled) {
			selectedLabel = '';
			return;
		}

		selectedLabel = (option.label || option.textContent || option.value).trim();
	}

	function handleChange(event: SelectChangeEvent) {
		const select = event.currentTarget;

		value = select.value;
		syncSelectedLabel(select);

		onchange?.(event);
	}

	$effect(() => {
		const select = ref;
		value;

		if (!select) return;

		queueMicrotask(() => syncSelectedLabel(select));
	});
</script>

<select
	bind:this={ref}
	bind:value
	data-slot="select"
	data-side={side}
	data-align={align}
	style={maxHeight ? `--select-content-max-height: ${maxHeight}` : undefined}
	class={join(
		'select',
		'flex items-center justify-between gap-2',
		widthClass,
		'h-9 rounded-md border bg-transparent',
		'text-sm whitespace-nowrap shadow-xs',
		'outline-none select-none',
		'transition-[color,box-shadow]',
		'dark:bg-border/30 dark:hover:bg-input/50',
		'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
		'disabled:cursor-not-allowed disabled:opacity-50',
		className,
	)}
	onchange={handleChange}
	{...restProps}>
	<button type="button" class={join('flex min-w-0 w-full items-center justify-between gap-2 px-3 py-2', triggerClass)}>
		<span class="flex min-w-0 items-center gap-2">
			{@render icon?.()}

			{#if selectedLabel}
				<span class="min-w-0 truncate">{selectedLabel}</span>
			{:else if placeholder}
				<span class="select-placeholder min-w-0 truncate text-muted-foreground">{placeholder}</span>
			{/if}
		</span>

		<ChevronDown class="size-4 shrink-0 text-muted-foreground opacity-50 pointer-events-none" />
	</button>

	{#if placeholder}
		<!-- Baseline placeholder: engines without base-select ignore the trigger <button> above, so the
		     placeholder must exist as a real (hidden, disabled) option to show in the native widget.
		     Kept after the button — base-select only treats the FIRST child button as the trigger. -->
		<option value="" disabled hidden>{placeholder}</option>
	{/if}
	{@render children?.()}
</select>

<style>
	/* Opt-in */
	:global(.select),
	:global(.select::picker(select)) {
		appearance: base-select;
	}

	/* Hide the default picker icon */
	:global(.select::picker-icon) {
		display: none;
	}

	/* Without customizable-select support (Firefox, Safari < 27) the classic native widget renders: the
	   trigger <button> is ignored entirely, so the select itself needs the trigger's inset. The arrow
	   and the popup stay the OS-native ones. */
	@supports not (appearance: base-select) {
		:global(.select) {
			padding-inline: 0.75rem 0.5rem;
		}

		/* The selected placeholder option shows in the closed widget; tint it like a placeholder. */
		:global(.select:has(option:disabled:checked)) {
			color: var(--muted-foreground);
		}
	}

	/* Hide the native checkmark completely */
	:global(.select option::checkmark) {
		display: none;
	}

	/* Rotate chevron when open - ONLY the trigger button's own (direct child) svg,
	   so a leading `icon` svg inside the span is left untouched. */
	:global(.select:open > button > svg) {
		transform: rotate(180deg);
	}

	:global(.select > button > svg) {
		transition: transform 0.2s ease;
	}

	/* Picker positioning & styling */
	:global(.select::picker(select)) {
		inset: unset;
		top: anchor(bottom);
		left: anchor(left);
		min-width: max(anchor-size(width), 8rem);
		max-height: var(--select-content-max-height, none);
		overflow-y: auto;
		overscroll-behavior: contain;
		margin-top: 0.25rem;
		position-try-fallbacks: flip-block, flip-inline;

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

	/* Open above the trigger */
	:global(.select[data-side='top']::picker(select)) {
		top: auto;
		bottom: anchor(top);
		margin-top: 0;
		margin-bottom: 0.25rem;
		transform: translateY(0.5rem);
	}

	/* Horizontal alignment */
	:global(.select[data-align='end']::picker(select)) {
		left: auto;
		right: anchor(right);
	}

	:global(.select[data-align='center']::picker(select)) {
		left: auto;
		right: auto;
		justify-self: anchor-center;
	}

	:global(.select:open::picker(select)) {
		opacity: 1;
		transform: translateY(0);
	}

	@starting-style {
		:global(.select:open::picker(select)) {
			opacity: 0;
			transform: translateY(-0.5rem);
		}

		:global(.select[data-side='top']:open::picker(select)) {
			transform: translateY(0.5rem);
		}
	}

	/* Options base styles */
	:global(.select option) {
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
	:global(.select option:checked) {
		background: var(--accent);
		color: var(--accent-foreground);
	}

	/* When hovering ANY option, remove highlight from checked (unless it's the one being hovered) */
	:global(.select:has(option:hover) option:checked:not(:hover)) {
		background: transparent;
		color: inherit;
	}

	/* Hovered option is always highlighted */
	:global(.select option:hover) {
		background: var(--accent);
		color: var(--accent-foreground);
	}

	/* Custom checkmark - hidden by default */
	:global(.select-checkmark) {
		position: absolute;
		right: 0.5rem;
		display: none;
		align-items: center;
		justify-content: center;
		width: 0.875rem;
		height: 0.875rem;
	}

	/* Show checkmark only when option is checked */
	:global(.select option:checked .select-checkmark) {
		display: flex;
	}
</style>
