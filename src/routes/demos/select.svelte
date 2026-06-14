<script lang="ts">
	import * as Select from '$lib/components/select/index';

	// Shared trigger sizing, factored out so each example stays copy-paste sized.
	const TRIGGER_SM = 'w-full max-w-sm';

	// 1 — single select (preserves the original working example)
	let fruit = $state('');

	// 2 — grouped + scrollable (timezones)
	const timezones: { region: string; zones: { value: string; label: string }[] }[] = [
		{
			region: 'North America',
			zones: [
				{ value: 'est', label: 'Eastern Standard Time (EST)' },
				{ value: 'cst', label: 'Central Standard Time (CST)' },
				{ value: 'mst', label: 'Mountain Standard Time (MST)' },
				{ value: 'pst', label: 'Pacific Standard Time (PST)' }
			]
		},
		{
			region: 'Europe & Africa',
			zones: [
				{ value: 'gmt', label: 'Greenwich Mean Time (GMT)' },
				{ value: 'cet', label: 'Central European Time (CET)' },
				{ value: 'eet', label: 'Eastern European Time (EET)' },
				{ value: 'wat', label: 'West Africa Time (WAT)' }
			]
		},
		{
			region: 'Asia',
			zones: [
				{ value: 'ist', label: 'India Standard Time (IST)' },
				{ value: 'cst-cn', label: 'China Standard Time (CST)' },
				{ value: 'jst', label: 'Japan Standard Time (JST)' }
			]
		}
	];
	let timezone = $state('');

	// 3 — with leading icon (status picker)
	const statuses: { value: string; label: string }[] = [
		{ value: 'backlog', label: 'Backlog' },
		{ value: 'todo', label: 'Todo' },
		{ value: 'in-progress', label: 'In progress' },
		{ value: 'done', label: 'Done' },
		{ value: 'canceled', label: 'Canceled' }
	];
	let status = $state('todo');

	// 4 — sizes (shared options)
	const sizes: { value: string; label: string }[] = [
		{ value: 'xs', label: 'Extra small' },
		{ value: 'sm', label: 'Small' },
		{ value: 'md', label: 'Medium' },
		{ value: 'lg', label: 'Large' }
	];
	let small = $state('');
	let large = $state('');

	// 5 — disabled items + disabled field
	const plans: { value: string; label: string; disabled?: boolean }[] = [
		{ value: 'free', label: 'Free' },
		{ value: 'pro', label: 'Pro' },
		{ value: 'team', label: 'Team', disabled: true },
		{ value: 'enterprise', label: 'Enterprise', disabled: true }
	];
	let plan = $state('');

	// 6 — placement (side / align)
	const colors: { value: string; label: string }[] = [
		{ value: 'red', label: 'Red' },
		{ value: 'green', label: 'Green' },
		{ value: 'blue', label: 'Blue' },
		{ value: 'violet', label: 'Violet' }
	];
	let color = $state('');
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — single select -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Single select</h3>
			<p class="text-muted-foreground mt-1 text-xs">Optgroups, with a placeholder.</p>
		</div>
		<Select.Root bind:value={fruit} placeholder="Select a fruit" class={TRIGGER_SM}>
			<Select.OptGroup label="Citrus">
				<Select.Option value="orange">Orange</Select.Option>
				<Select.Option value="lemon">Lemon</Select.Option>
				<Select.Option value="grapefruit">Grapefruit</Select.Option>
			</Select.OptGroup>
			<Select.OptGroup label="Berries">
				<Select.Option value="strawberry">Strawberry</Select.Option>
				<Select.Option value="blueberry">Blueberry</Select.Option>
				<Select.Option value="raspberry">Raspberry</Select.Option>
			</Select.OptGroup>
		</Select.Root>
	</section>

	<!-- 2 — grouped + scrollable -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Scrollable groups</h3>
			<p class="text-muted-foreground mt-1 text-xs">Capped height via maxHeight; scrolls.</p>
		</div>
		<Select.Root bind:value={timezone} placeholder="Select a timezone" maxHeight="15rem" class={TRIGGER_SM}>
			{#each timezones as group (group.region)}
				<Select.OptGroup label={group.region}>
					{#each group.zones as zone (zone.value)}
						<Select.Option value={zone.value}>{zone.label}</Select.Option>
					{/each}
				</Select.OptGroup>
			{/each}
		</Select.Root>
	</section>

	<!-- 3 — with leading icon -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With icon</h3>
			<p class="text-muted-foreground mt-1 text-xs">Leading trigger icon via the icon snippet.</p>
		</div>
		<Select.Root bind:value={status} class={TRIGGER_SM}>
			{#snippet icon()}
				<span class="bg-emerald-500 size-2 shrink-0 rounded-full" aria-hidden="true"></span>
			{/snippet}
			{#each statuses as s (s.value)}
				<Select.Option value={s.value}>{s.label}</Select.Option>
			{/each}
		</Select.Root>
	</section>

	<!-- 4 — sizes -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Sizes</h3>
			<p class="text-muted-foreground mt-1 text-xs">Tune height with trigger classes.</p>
		</div>
		<div class="flex flex-col gap-2">
			<Select.Root bind:value={small} placeholder="Small" class="h-8 w-full max-w-sm text-xs">
				{#each sizes as s (s.value)}
					<Select.Option value={s.value}>{s.label}</Select.Option>
				{/each}
			</Select.Root>
			<Select.Root bind:value={large} placeholder="Large" class="h-11 w-full max-w-sm text-base">
				{#each sizes as s (s.value)}
					<Select.Option value={s.value}>{s.label}</Select.Option>
				{/each}
			</Select.Root>
		</div>
	</section>

	<!-- 5 — disabled -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Disabled</h3>
			<p class="text-muted-foreground mt-1 text-xs">Disabled options, plus a disabled field.</p>
		</div>
		<div class="flex flex-col gap-2">
			<Select.Root bind:value={plan} placeholder="Choose a plan" class={TRIGGER_SM}>
				{#each plans as p (p.value)}
					<Select.Option value={p.value} disabled={p.disabled}>{p.label}</Select.Option>
				{/each}
			</Select.Root>
			<Select.Root value="pro" disabled class={TRIGGER_SM}>
				<Select.Option value="pro">Pro</Select.Option>
			</Select.Root>
		</div>
	</section>

	<!-- 6 — placement -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Placement</h3>
			<p class="text-muted-foreground mt-1 text-xs">Open upward and end-aligned via side/align.</p>
		</div>
		<Select.Root bind:value={color} placeholder="Pick a color" side="top" align="end" class={TRIGGER_SM}>
			{#each colors as c (c.value)}
				<Select.Option value={c.value}>{c.label}</Select.Option>
			{/each}
		</Select.Root>
	</section>
</div>
