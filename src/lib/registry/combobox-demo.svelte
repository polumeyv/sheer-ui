<script lang="ts">
	// `components/combobox` is the headless bits primitive (like select). The Input
	// and Trigger ship baked shadcn styling, but the popover Content + Items do not —
	// those class strings are copied from the project's styled select block.
	import * as Combobox from '../components/combobox/index.js';
	import Check from '@lucide/svelte/icons/check';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';

	const frameworks = [
		{ value: 'sveltekit', label: 'SvelteKit' },
		{ value: 'next', label: 'Next.js' },
		{ value: 'astro', label: 'Astro' },
		{ value: 'nuxt', label: 'Nuxt.js' },
		{ value: 'remix', label: 'Remix' },
		{ value: 'solidstart', label: 'SolidStart' },
	];

	let value = $state('');
	let search = $state('');

	// Searchable: narrow the list by the typed text (case-insensitive). When a value
	// is already chosen, an empty box should still show every option.
	const filtered = $derived(
		search && search !== frameworks.find((f) => f.value === value)?.label
			? frameworks.filter((f) => f.label.toLowerCase().includes(search.toLowerCase()))
			: frameworks,
	);
</script>

<Combobox.Root type="single" bind:value bind:inputValue={search} items={filtered}>
	<div class="relative w-56">
		<Combobox.Input placeholder="Search framework…" />
		<Combobox.Trigger>
			<ChevronsUpDown class="size-4" />
		</Combobox.Trigger>
	</div>
	<Combobox.Portal>
		<Combobox.Content
			class="z-50 max-h-(--bits-combobox-content-available-height) w-(--bits-combobox-anchor-width) min-w-(--bits-combobox-anchor-width) select-none overflow-hidden rounded-xl border bg-popover px-1 py-2 text-popover-foreground shadow-md outline-hidden transition-[opacity,scale,translate] starting:opacity-0 starting:scale-95 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data-[side=bottom]:starting:-translate-y-1 data-[side=top]:starting:translate-y-1"
			sideOffset={6}>
			<Combobox.Viewport class="p-1">
				{#each filtered as item (item.value)}
					<Combobox.Item
						class="flex h-9 w-full select-none items-center rounded-sm py-1.5 pl-3 pr-1.5 text-sm outline-hidden data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-50"
						value={item.value}
						label={item.label}>
						{#snippet children({ selected })}
							{item.label}
							{#if selected}
								<div class="ml-auto">
									<Check class="size-4" />
								</div>
							{/if}
						{/snippet}
					</Combobox.Item>
				{:else}
					<div class="text-muted-foreground px-3 py-2 text-sm">No frameworks found.</div>
				{/each}
			</Combobox.Viewport>
		</Combobox.Content>
	</Combobox.Portal>
</Combobox.Root>
