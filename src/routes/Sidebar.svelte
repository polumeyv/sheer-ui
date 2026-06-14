<script lang="ts">
	import { page } from '$app/state';
	import { components } from './registry';
</script>

<nav class="flex flex-col gap-0.5 p-4">
	<p class="mb-2 px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
		Components
	</p>
	{#each components as component (component.slug)}
		{@const href = `/components/${component.slug}`}
		<a
			{href}
			class="rounded-md px-2 py-1.5 text-sm transition-colors {page.url.pathname === href
				? 'bg-accent font-medium text-accent-foreground'
				: 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'}"
		>
			{component.title}
		</a>
	{/each}
</nav>
