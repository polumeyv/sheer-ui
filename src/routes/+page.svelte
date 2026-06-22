<script lang="ts">
	import * as Card from "$lib/components/card/index.js";
	import { Badge } from "$lib/components/badge/index.js";
	import { components } from "./components/_registry.js";
	import { slugsWithDemos } from "./components/_demos.js";
</script>

<svelte:head>
	<title>@polumeyv/ui — component demo</title>
</svelte:head>

<div class="mx-auto max-w-5xl space-y-8">
	<div class="space-y-3">
		<h1 class="text-4xl font-bold tracking-tight">@polumeyv/ui</h1>
		<p class="text-muted-foreground max-w-2xl text-lg">
			A Svelte 5 component library. Every component below is demoed with its own real styling — the
			demo adds no CSS of its own.
		</p>
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="secondary">Svelte 5</Badge>
			<Badge variant="secondary">Tailwind v4</Badge>
			<Badge variant="outline">{components.length} components</Badge>
			<Badge variant="outline">{slugsWithDemos.size} with demos</Badge>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each components as component (component.slug)}
			<a href="/components/{component.slug}" class="group block">
				<Card.Root class="hover:border-primary/50 h-full gap-2 transition-colors">
					<Card.Header>
						<Card.Title class="group-hover:text-primary flex items-center gap-2 transition-colors">
							{component.name}
							{#if !slugsWithDemos.has(component.slug)}
								<Badge variant="outline" class="text-muted-foreground font-normal">soon</Badge>
							{/if}
						</Card.Title>
						<Card.Description>{component.description}</Card.Description>
					</Card.Header>
				</Card.Root>
			</a>
		{/each}
	</div>
</div>
