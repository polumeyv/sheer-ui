<script lang="ts">
	import { page } from '$app/state';
	import * as Sidebar from '$lib/components/sidebar/index.js';
	import { components } from './_registry.js';

	let query = $state('');

	const filtered = $derived(
		query.trim() ? components.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase())) : components,
	);
</script>

<Sidebar.Root>
	<Sidebar.Header class="gap-2">
		<a href="/" class="px-2 py-1 text-sm font-semibold">@polumeyv/ui</a>
		<Sidebar.Input bind:value={query} placeholder="Search components..." />
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Components ({filtered.length})</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each filtered as component (component.slug)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton isActive={page.url.pathname === `/components/${component.slug}`}>
								{#snippet child({ props })}
									<a href="/components/{component.slug}" {...props}>{component.name}</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{:else}
						<p class="text-muted-foreground px-2 py-1 text-sm">No matches.</p>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Rail />
</Sidebar.Root>
