<script lang="ts" module>
	export type SelectItem = { value: string; label: string; disabled?: boolean };
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as Select from '$lib/components/select/index.js';
	import { cn } from '$lib/utils.js';
	import Check from '@lucide/svelte/icons/check';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import ChevronsUp from '@lucide/svelte/icons/chevrons-up';
	import ChevronsDown from '@lucide/svelte/icons/chevrons-down';

	interface Props {
		/** The options to choose from (replaces the example's hard-coded theme list). */
		items: SelectItem[];
		/** Selected value (bindable). */
		value?: string;
		/** Trigger text shown when nothing is selected. */
		placeholder?: string;
		/** Allow clearing the selection by re-picking the active item. */
		allowDeselect?: boolean;
		/** Accessible name for the trigger. */
		label?: string;
		/** Leading content rendered inside the trigger before the value (e.g. an icon). */
		leading?: Snippet;
		/** Per-instance class overrides, merged onto the base styling. */
		triggerClass?: string;
		contentClass?: string;
		itemClass?: string;
		/** Gap between the trigger and the dropdown. */
		sideOffset?: number;
		onValueChange?: (value: string) => void;
	}

	let {
		items,
		value = $bindable(),
		placeholder = 'Select…',
		allowDeselect = true,
		label,
		leading,
		triggerClass,
		contentClass,
		itemClass,
		sideOffset = 10,
		onValueChange,
	}: Props = $props();
</script>

<Select.Root type="single" {items} bind:value {allowDeselect} {onValueChange}>
	<Select.Trigger
		class={cn(
			'inline-flex h-9 w-74 touch-none select-none items-center rounded-md border border-input bg-background px-2.75 text-sm transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] data-placeholder:text-muted-foreground',
			triggerClass,
		)}
		aria-label={label}>
		{@render leading?.()}
		<Select.Value {placeholder} />
		<ChevronsUpDown class="text-muted-foreground ml-auto size-6" />
	</Select.Trigger>
	<Select.Portal>
		<Select.Content
			class={cn(
				'z-50 h-96 max-h-(--bits-select-content-available-height) w-(--bits-select-anchor-width) min-w-(--bits-select-anchor-width) select-none overflow-hidden rounded-xl border bg-popover px-1 py-3 text-popover-foreground shadow-md outline-hidden transition-[opacity,scale,translate] starting:opacity-0 starting:scale-95 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data-[side=bottom]:starting:-translate-y-1 data-[side=top]:starting:translate-y-1 data-[side=left]:starting:translate-x-1 data-[side=right]:starting:-translate-x-1',
				contentClass,
			)}
			{sideOffset}>
			<Select.ScrollUpButton class="grid w-full place-items-center">
				<ChevronsUp class="size-3" />
			</Select.ScrollUpButton>
			<Select.Viewport class="p-1">
				{#each items as item (item.value)}
					<Select.Item
						class={cn(
							'flex h-10 w-full select-none items-center rounded-sm py-3 pl-5 pr-1.5 text-sm capitalize outline-hidden data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-50',
							itemClass,
						)}
						value={item.value}
						label={item.label}
						disabled={item.disabled}>
						{#snippet children({ selected })}
							{item.label}
							{#if selected}
								<div class="ml-auto">
									<Check aria-label="check" />
								</div>
							{/if}
						{/snippet}
					</Select.Item>
				{/each}
			</Select.Viewport>
			<Select.ScrollDownButton class="grid w-full place-items-center">
				<ChevronsDown class="size-3" />
			</Select.ScrollDownButton>
		</Select.Content>
	</Select.Portal>
</Select.Root>
