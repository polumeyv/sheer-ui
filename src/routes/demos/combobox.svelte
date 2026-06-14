<script lang="ts">
	import { Combobox } from '$lib/components/combobox/index';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';

	const fruits = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'blueberry', label: 'Blueberry' },
		{ value: 'grapes', label: 'Grapes' },
		{ value: 'pineapple', label: 'Pineapple' }
	];

	let value = $state('');
	let searchValue = $state('');

	const filtered = $derived(
		searchValue === ''
			? fruits
			: fruits.filter((f) => f.label.toLowerCase().includes(searchValue.toLowerCase()))
	);

	const selectedLabel = $derived(fruits.find((f) => f.value === value)?.label ?? '');
</script>

<Combobox.Root type="single" bind:value name="fruit">
	<div class="relative w-full max-w-sm">
		<Combobox.Input
			oninput={(e) => (searchValue = e.currentTarget.value)}
			placeholder="Search a fruit..."
			aria-label="Search a fruit"
			defaultValue={selectedLabel}
			class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-md border ps-3 pe-10 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
		/>
		<Combobox.Trigger
			class="text-muted-foreground absolute inset-e-0 top-0 flex h-10 w-10 items-center justify-center"
		>
			<ChevronsUpDownIcon class="size-4" />
		</Combobox.Trigger>
	</div>

	<Combobox.Content
		sideOffset={4}
		class="bg-popover text-popover-foreground z-50 max-h-60 w-(--bits-combobox-anchor-width) min-w-(--bits-combobox-anchor-width) overflow-y-auto rounded-md border shadow-md"
	>
		<Combobox.Viewport class="p-1">
			{#each filtered as fruit (fruit.value)}
				<Combobox.Item
					value={fruit.value}
					label={fruit.label}
					class="data-highlighted:bg-accent data-highlighted:text-accent-foreground relative flex w-full cursor-default items-center rounded-md py-1.5 ps-2 pe-8 text-sm outline-none select-none"
				>
					{#snippet children({ selected })}
						{fruit.label}
						{#if selected}
							<span class="absolute inset-e-2 flex items-center">
								<CheckIcon class="size-4" />
							</span>
						{/if}
					{/snippet}
				</Combobox.Item>
			{:else}
				<div class="text-muted-foreground py-2 text-center text-sm">No results found.</div>
			{/each}
		</Combobox.Viewport>
	</Combobox.Content>
</Combobox.Root>
