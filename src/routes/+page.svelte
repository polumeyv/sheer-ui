<script lang="ts">
	import * as Card from '#lib/components/card/index.js';
	import { Badge } from '#lib/components/badge';
	import { components } from './components/_registry.js';
	import { slugsWithDemos } from './components/_demos.js';
	import { blocks } from './blocks/_registry.js';
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
			<Badge variant="outline">{components.length} components</Badge>
			<Badge variant="outline">{blocks.length} blocks</Badge>
			<Badge variant="outline">{slugsWithDemos.size} with demos</Badge>
		</div>
	</div>

	{#if blocks.length}
		<div class="space-y-4">
			<h2 class="text-2xl font-semibold tracking-tight">Blocks</h2>
			<p class="text-sm text-muted-foreground">Full, app-ready compositions — not the headless components.</p>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each blocks as block (block.slug)}
					<a href="/blocks/{block.slug}" class="group block">
						<Card.Root class="h-full gap-2 transition-colors hover:border-primary/50">
							<Card.Header>
								<Card.Title class="transition-colors group-hover:text-primary">{block.name}</Card.Title>
								<Card.Description>{block.description}</Card.Description>
							</Card.Header>
						</Card.Root>
					</a>
				{/each}
			</div>
		</div>
	{/if}

	<div class="space-y-4">
		<h2 class="text-2xl font-semibold tracking-tight">Components</h2>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each components as component (component.slug)}
				<a href="/components/{component.slug}" class="group block">
					<Card.Root class="h-full gap-2 transition-colors hover:border-primary/50">
						<Card.Header>
							<Card.Title class="flex items-center gap-2 transition-colors group-hover:text-primary">
								{component.name}
								{#if !slugsWithDemos.has(component.slug)}
									<Badge variant="outline" class="font-normal text-muted-foreground">soon</Badge>
								{/if}
							</Card.Title>
							<Card.Description>{component.description}</Card.Description>
						</Card.Header>
					</Card.Root>
				</a>
			{/each}
		</div>
	</div>
</div>
