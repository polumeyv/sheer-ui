<script lang="ts">
	import * as Sidebar from '$lib/components/sidebar/index.js';
	import HouseIcon from '@lucide/svelte/icons/house';
	import InboxIcon from '@lucide/svelte/icons/inbox';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import SearchIcon from '@lucide/svelte/icons/search';
	import SettingsIcon from '@lucide/svelte/icons/settings';

	const items = [
		{ title: 'Home', icon: HouseIcon },
		{ title: 'Inbox', icon: InboxIcon },
		{ title: 'Calendar', icon: CalendarIcon },
		{ title: 'Search', icon: SearchIcon },
		{ title: 'Settings', icon: SettingsIcon }
	];
</script>

<div class="h-80 w-full overflow-hidden rounded-lg border">
	<Sidebar.Provider class="min-h-full!" style="--sidebar-width: 12rem;">
		<Sidebar.Root collapsible="none" class="h-full">
			<Sidebar.Header class="px-4 py-3 text-sm font-semibold">Acme Inc</Sidebar.Header>
			<Sidebar.Content>
				<Sidebar.Group>
					<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
					<Sidebar.GroupContent>
						<Sidebar.Menu>
							{#each items as item (item.title)}
								<Sidebar.MenuItem>
									<Sidebar.MenuButton>
										{#snippet child({ props })}
											<a href="#" {...props}>
												<item.icon />
												<span>{item.title}</span>
											</a>
										{/snippet}
									</Sidebar.MenuButton>
								</Sidebar.MenuItem>
							{/each}
						</Sidebar.Menu>
					</Sidebar.GroupContent>
				</Sidebar.Group>
			</Sidebar.Content>
		</Sidebar.Root>
		<Sidebar.Inset>
			<header class="flex h-12 items-center gap-2 border-b px-4">
				<Sidebar.Trigger />
				<span class="text-sm font-medium">Dashboard</span>
			</header>
			<div class="flex flex-1 items-center justify-center p-4 text-sm text-muted-foreground">
				Content area
			</div>
		</Sidebar.Inset>
	</Sidebar.Provider>
</div>
