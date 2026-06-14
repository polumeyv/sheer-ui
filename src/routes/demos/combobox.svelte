<script lang="ts">
	import type { Component } from 'svelte';
	import { Combobox } from '$lib/components/combobox/index';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import CircleIcon from '@lucide/svelte/icons/circle';
	import CircleDashedIcon from '@lucide/svelte/icons/circle-dashed';
	import CircleDotIcon from '@lucide/svelte/icons/circle-dot';
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
	import CircleXIcon from '@lucide/svelte/icons/circle-x';

	// Shared part styling, factored out so each example stays copy-paste sized.
	const INPUT =
		'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-md border ps-3 pe-10 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50';
	const TRIGGER =
		'text-muted-foreground absolute inset-e-0 top-0 flex h-10 w-10 items-center justify-center disabled:opacity-50';
	const CONTENT =
		'bg-popover text-popover-foreground z-50 max-h-60 w-(--bits-combobox-anchor-width) min-w-(--bits-combobox-anchor-width) overflow-y-auto rounded-md border shadow-md';
	const VIEWPORT = 'p-1';
	const ITEM =
		'data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 relative flex w-full cursor-default items-center gap-2 rounded-md py-1.5 ps-2 pe-8 text-sm outline-none select-none';
	const HEADING = 'text-muted-foreground px-2 py-1.5 text-xs font-medium';
	const EMPTY = 'text-muted-foreground py-6 text-center text-sm';
	const CHECK = 'text-muted-foreground absolute inset-e-2 size-4';

	type Option = { value: string; label: string; disabled?: boolean };

	function filterBy<T extends { label: string }>(list: T[], query: string): T[] {
		const q = query.trim().toLowerCase();
		return q === '' ? list : list.filter((i) => i.label.toLowerCase().includes(q));
	}

	// 1 — single select
	const fruits: Option[] = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'blueberry', label: 'Blueberry' },
		{ value: 'grapes', label: 'Grapes' },
		{ value: 'pineapple', label: 'Pineapple' }
	];
	let fruit = $state('');
	let fruitSearch = $state('');
	const fruitFiltered = $derived(filterBy(fruits, fruitSearch));
	const fruitLabel = $derived(fruits.find((f) => f.value === fruit)?.label ?? '');

	// 2 — multiple select
	const frameworks: Option[] = [
		{ value: 'sveltekit', label: 'SvelteKit' },
		{ value: 'next', label: 'Next.js' },
		{ value: 'nuxt', label: 'Nuxt' },
		{ value: 'remix', label: 'Remix' },
		{ value: 'astro', label: 'Astro' },
		{ value: 'solid', label: 'SolidStart' }
	];
	let langs = $state<string[]>(['sveltekit']);
	let langSearch = $state('');
	const langFiltered = $derived(filterBy(frameworks, langSearch));

	// 3 — grouped
	const foodGroups: { heading: string; items: Option[] }[] = [
		{
			heading: 'Fruits',
			items: [
				{ value: 'apple', label: 'Apple' },
				{ value: 'orange', label: 'Orange' },
				{ value: 'mango', label: 'Mango' }
			]
		},
		{
			heading: 'Vegetables',
			items: [
				{ value: 'carrot', label: 'Carrot' },
				{ value: 'broccoli', label: 'Broccoli' },
				{ value: 'spinach', label: 'Spinach' }
			]
		}
	];
	let food = $state('');
	let foodSearch = $state('');
	const foodFiltered = $derived(
		foodGroups
			.map((g) => ({ heading: g.heading, items: filterBy(g.items, foodSearch) }))
			.filter((g) => g.items.length > 0)
	);
	const foodLabel = $derived(
		foodGroups.flatMap((g) => g.items).find((i) => i.value === food)?.label ?? ''
	);

	// 4 — with icons (status selector)
	type Status = Option & { icon: Component; color: string };
	const statuses: Status[] = [
		{ value: 'backlog', label: 'Backlog', icon: CircleDashedIcon, color: 'text-muted-foreground' },
		{ value: 'todo', label: 'Todo', icon: CircleIcon, color: 'text-muted-foreground' },
		{ value: 'in-progress', label: 'In progress', icon: CircleDotIcon, color: 'text-amber-500' },
		{ value: 'done', label: 'Done', icon: CircleCheckIcon, color: 'text-emerald-500' },
		{ value: 'canceled', label: 'Canceled', icon: CircleXIcon, color: 'text-red-500' }
	];
	let status = $state('');
	let statusSearch = $state('');
	const statusFiltered = $derived(filterBy(statuses, statusSearch));

	// 5 — disabled items + disabled field
	const plans: Option[] = [
		{ value: 'free', label: 'Free' },
		{ value: 'pro', label: 'Pro' },
		{ value: 'team', label: 'Team', disabled: true },
		{ value: 'enterprise', label: 'Enterprise', disabled: true }
	];
	let plan = $state('');
	let planSearch = $state('');
	const planFiltered = $derived(filterBy(plans, planSearch));
	const planLabel = $derived(plans.find((p) => p.value === plan)?.label ?? '');
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — single select -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Single select</h3>
			<p class="text-muted-foreground mt-1 text-xs">Type to filter, click to choose.</p>
		</div>
		<Combobox.Root type="single" bind:value={fruit} name="fruit" onOpenChange={(o) => { if (o) fruitSearch = ''; }}>
			<div class="relative w-full">
				<Combobox.Input
					oninput={(e) => (fruitSearch = e.currentTarget.value)}
					placeholder="Search a fruit…"
					aria-label="Search a fruit"
					defaultValue={fruitLabel}
					class={INPUT}
				/>
				<Combobox.Trigger class={TRIGGER}>
					<ChevronsUpDownIcon class="size-4" />
				</Combobox.Trigger>
			</div>
			<Combobox.Content sideOffset={4} class={CONTENT}>
				<Combobox.Viewport class={VIEWPORT}>
					{#each fruitFiltered as f (f.value)}
						<Combobox.Item value={f.value} label={f.label} class={ITEM}>
							{#snippet children({ selected })}
								{f.label}
								{#if selected}<CheckIcon class={CHECK} />{/if}
							{/snippet}
						</Combobox.Item>
					{:else}
						<div class={EMPTY}>No results found.</div>
					{/each}
				</Combobox.Viewport>
			</Combobox.Content>
		</Combobox.Root>
	</section>

	<!-- 2 — multiple select -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Multi-select</h3>
			<p class="text-muted-foreground mt-1 text-xs">Pick several; remove from the chips.</p>
		</div>
		<Combobox.Root type="multiple" bind:value={langs} name="frameworks" onOpenChange={(o) => { if (o) langSearch = ''; }}>
			<div class="relative w-full">
				<Combobox.Input
					oninput={(e) => (langSearch = e.currentTarget.value)}
					placeholder="Search frameworks…"
					aria-label="Search frameworks"
					class={INPUT}
				/>
				<Combobox.Trigger class={TRIGGER}>
					<ChevronsUpDownIcon class="size-4" />
				</Combobox.Trigger>
			</div>
			<Combobox.Content sideOffset={4} class={CONTENT}>
				<Combobox.Viewport class={VIEWPORT}>
					{#each langFiltered as f (f.value)}
						<Combobox.Item value={f.value} label={f.label} class={ITEM}>
							{#snippet children({ selected })}
								{f.label}
								{#if selected}<CheckIcon class={CHECK} />{/if}
							{/snippet}
						</Combobox.Item>
					{:else}
						<div class={EMPTY}>No results found.</div>
					{/each}
				</Combobox.Viewport>
			</Combobox.Content>
		</Combobox.Root>
		{#if langs.length}
			<div class="flex flex-wrap gap-1">
				{#each langs as v (v)}
					{@const label = frameworks.find((f) => f.value === v)?.label ?? v}
					<span class="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs">
						{label}
						<button
							type="button"
							class="hover:text-foreground leading-none"
							aria-label={`Remove ${label}`}
							onclick={() => (langs = langs.filter((x) => x !== v))}
						>×</button>
					</span>
				{/each}
			</div>
		{/if}
	</section>

	<!-- 3 — grouped -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Grouped</h3>
			<p class="text-muted-foreground mt-1 text-xs">Group, GroupHeading and Separator.</p>
		</div>
		<Combobox.Root type="single" bind:value={food} onOpenChange={(o) => { if (o) foodSearch = ''; }}>
			<div class="relative w-full">
				<Combobox.Input
					oninput={(e) => (foodSearch = e.currentTarget.value)}
					placeholder="Search produce…"
					aria-label="Search produce"
					defaultValue={foodLabel}
					class={INPUT}
				/>
				<Combobox.Trigger class={TRIGGER}>
					<ChevronsUpDownIcon class="size-4" />
				</Combobox.Trigger>
			</div>
			<Combobox.Content sideOffset={4} class={CONTENT}>
				<Combobox.Viewport class={VIEWPORT}>
					{#each foodFiltered as group, i (group.heading)}
						<Combobox.Group>
							<Combobox.GroupHeading class={HEADING}>{group.heading}</Combobox.GroupHeading>
							{#each group.items as f (f.value)}
								<Combobox.Item value={f.value} label={f.label} class={ITEM}>
									{#snippet children({ selected })}
										{f.label}
										{#if selected}<CheckIcon class={CHECK} />{/if}
									{/snippet}
								</Combobox.Item>
							{/each}
						</Combobox.Group>
						{#if i < foodFiltered.length - 1}
							<Combobox.Separator class="bg-border -mx-1 my-1 h-px" />
						{/if}
					{:else}
						<div class={EMPTY}>No results found.</div>
					{/each}
				</Combobox.Viewport>
			</Combobox.Content>
		</Combobox.Root>
	</section>

	<!-- 4 — with icons -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With icons</h3>
			<p class="text-muted-foreground mt-1 text-xs">Per-item leading icon, like a status picker.</p>
		</div>
		<Combobox.Root type="single" bind:value={status} onOpenChange={(o) => { if (o) statusSearch = ''; }}>
			<div class="relative w-full">
				<Combobox.Input
					oninput={(e) => (statusSearch = e.currentTarget.value)}
					placeholder="Set status…"
					aria-label="Set status"
					defaultValue={statuses.find((s) => s.value === status)?.label ?? ''}
					class={INPUT}
				/>
				<Combobox.Trigger class={TRIGGER}>
					<ChevronsUpDownIcon class="size-4" />
				</Combobox.Trigger>
			</div>
			<Combobox.Content sideOffset={4} class={CONTENT}>
				<Combobox.Viewport class={VIEWPORT}>
					{#each statusFiltered as s (s.value)}
						{@const Icon = s.icon}
						<Combobox.Item value={s.value} label={s.label} class={ITEM}>
							{#snippet children({ selected })}
								<Icon class={`size-4 ${s.color}`} />
								{s.label}
								{#if selected}<CheckIcon class={CHECK} />{/if}
							{/snippet}
						</Combobox.Item>
					{:else}
						<div class={EMPTY}>No results found.</div>
					{/each}
				</Combobox.Viewport>
			</Combobox.Content>
		</Combobox.Root>
	</section>

	<!-- 5 — disabled -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Disabled</h3>
			<p class="text-muted-foreground mt-1 text-xs">Disabled items, plus a disabled field.</p>
		</div>
		<Combobox.Root type="single" bind:value={plan} onOpenChange={(o) => { if (o) planSearch = ''; }}>
			<div class="relative w-full">
				<Combobox.Input
					oninput={(e) => (planSearch = e.currentTarget.value)}
					placeholder="Choose a plan…"
					aria-label="Choose a plan"
					defaultValue={planLabel}
					class={INPUT}
				/>
				<Combobox.Trigger class={TRIGGER}>
					<ChevronsUpDownIcon class="size-4" />
				</Combobox.Trigger>
			</div>
			<Combobox.Content sideOffset={4} class={CONTENT}>
				<Combobox.Viewport class={VIEWPORT}>
					{#each planFiltered as p (p.value)}
						<Combobox.Item value={p.value} label={p.label} disabled={p.disabled} class={ITEM}>
							{#snippet children({ selected })}
								{p.label}
								{#if p.disabled}<span class="text-muted-foreground ms-auto text-xs">Soon</span>{/if}
								{#if selected}<CheckIcon class={CHECK} />{/if}
							{/snippet}
						</Combobox.Item>
					{:else}
						<div class={EMPTY}>No results found.</div>
					{/each}
				</Combobox.Viewport>
			</Combobox.Content>
		</Combobox.Root>
		<Combobox.Root type="single" disabled>
			<div class="relative w-full">
				<Combobox.Input
					placeholder="Disabled"
					aria-label="Disabled combobox"
					defaultValue="Pro"
					disabled
					class={INPUT}
				/>
				<Combobox.Trigger class={TRIGGER} disabled>
					<ChevronsUpDownIcon class="size-4" />
				</Combobox.Trigger>
			</div>
		</Combobox.Root>
	</section>
</div>
