<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import * as Sidebar from '#lib/components/sidebar/index.js';
	import { entries, groups } from './_registry.js';

	let query = $state('');

	const filtered = $derived(
		query.trim() ? entries.filter((entry) => entry.name.toLowerCase().includes(query.trim().toLowerCase())) : entries,
	);
</script>

<Sidebar.Root>
	<Sidebar.Header class="gap-2">
		<a href={resolve('')} class="px-2 py-1 text-sm font-semibold">@polumeyv/ui</a>
		<Sidebar.Input bind:value={query} placeholder="Search..." />
	</Sidebar.Header>
	<Sidebar.Content>
		{#each groups as group (group.kind)}
			{@const items = filtered.filter((entry) => entry.kind === group.kind)}
			{#if items.length}
				<Sidebar.Group>
					<Sidebar.GroupLabel>{group.label} ({items.length})</Sidebar.GroupLabel>
					<Sidebar.GroupContent>
						<Sidebar.Menu>
							{#each items as item (item.slug)}
								<Sidebar.MenuItem>
									<Sidebar.MenuButton isActive={page.url.pathname === `/components/${item.slug}`}>
										{#snippet child({ props })}
											<a href={resolve(`components/${item.slug}`)} {...props}>{item.name}</a>
										{/snippet}
									</Sidebar.MenuButton>
								</Sidebar.MenuItem>
							{/each}
						</Sidebar.Menu>
					</Sidebar.GroupContent>
				</Sidebar.Group>
			{/if}
		{/each}
		{#if !filtered.length}
			<p class="px-2 py-1 text-sm text-muted-foreground">No matches.</p>
		{/if}
	</Sidebar.Content>
	<Sidebar.Rail />
</Sidebar.Root>
