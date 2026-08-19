<script lang="ts">
	import { resolve } from '$app/paths';
	import * as Card from '#lib/components/card/index.js';
	import { Badge } from '#lib/components/badge/index.js';
	import { entries, groups } from './components/_registry.js';
	import { slugsWithDemos } from './components/_demos.js';
</script>

<svelte:head>
	<title>@polumeyv/ui — component demo</title>
</svelte:head>

<div class="mx-auto max-w-5xl space-y-8">
	<div class="space-y-3">
		<h1 class="text-4xl font-bold tracking-tight">@polumeyv/ui</h1>
		<p class="max-w-2xl text-lg text-muted-foreground">
			A Svelte 5 component library. Every component below is demoed with its own real styling — the demo adds no CSS of its own.
		</p>
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="secondary">Svelte 5</Badge>
			<Badge variant="secondary">Tailwind v4</Badge>
			{#each groups as group (group.kind)}
				<Badge variant="outline">{entries.filter((entry) => entry.kind === group.kind).length} {group.label.toLowerCase()}</Badge>
			{/each}
			<Badge variant="outline">{slugsWithDemos.size} with demos</Badge>
		</div>
	</div>

	{#each groups as group (group.kind)}
		{@const items = entries.filter((entry) => entry.kind === group.kind)}
		{#if items.length}
			<div class="space-y-4">
				<h2 class="text-2xl font-semibold tracking-tight">{group.label}</h2>
				{#if group.blurb}
					<p class="text-sm text-muted-foreground">{group.blurb}</p>
				{/if}
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each items as item (item.slug)}
						<a href={resolve(`components/${item.slug}`)} class="group block">
							<Card.Root class="h-full gap-2 transition-colors hover:border-primary/50">
								<Card.Header>
									<Card.Title class="flex items-center gap-2 transition-colors group-hover:text-primary">
										{item.name}
										{#if !slugsWithDemos.has(item.slug)}
											<Badge variant="outline" class="font-normal text-muted-foreground">soon</Badge>
										{/if}
									</Card.Title>
									<Card.Description>{item.description}</Card.Description>
								</Card.Header>
							</Card.Root>
						</a>
					{/each}
				</div>
			</div>
		{/if}
	{/each}
</div>
