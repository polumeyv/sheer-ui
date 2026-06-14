<script lang="ts">
	import { components } from './registry';
</script>

<div class="mx-auto max-w-5xl">
	<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Polumeyv UI</h1>
	<p class="mt-3 max-w-2xl text-lg text-muted-foreground">
		A Svelte 5 component library. Browse all {components.length} components below, or pick one from the
		sidebar.
	</p>

	<div class="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
		{#each components as component (component.slug)}
			<a
				href="/components/{component.slug}"
				class="group rounded-lg border border-border p-4 transition-colors hover:bg-accent/40"
			>
				<p class="font-medium">{component.title}</p>
				<p class="mt-1 line-clamp-2 text-sm text-muted-foreground">{component.description}</p>
			</a>
		{/each}
	</div>
</div>
