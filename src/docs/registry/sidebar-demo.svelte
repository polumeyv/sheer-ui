<script lang="ts">
	import * as Sidebar from '../../lib/components/sidebar/index.js';
	import HouseIcon from '@lucide/svelte/icons/house';
	import InboxIcon from '@lucide/svelte/icons/inbox';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import SearchIcon from '@lucide/svelte/icons/search';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';


	const items = [
		{ title: 'Home', icon: HouseIcon, active: true },
		{ title: 'Inbox', icon: InboxIcon },
		{ title: 'Calendar', icon: CalendarIcon },
		{ title: 'Search', icon: SearchIcon },
		{ title: 'Settings', icon: SettingsIcon },
	];
</script>

<div class="relative isolate h-112 w-full overflow-hidden rounded-lg border bg-background transform-gpu">
	<Sidebar.Provider open class="relative min-h-0! h-full overflow-hidden" style="--sidebar-width: 13rem;">
		{#snippet children(sidebar)}
		<Sidebar.Root variant="inset" collapsible="icon" class="absolute! h-full!">
			<Sidebar.Header>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton size="lg" tooltipContent="Acme Inc" class="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground">
							<div class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg text-xs font-semibold">
								A
							</div>
							<div class="grid flex-1 text-start text-sm leading-tight">
								<span class="truncate font-medium">Acme Inc</span>
								<span class="truncate text-xs text-muted-foreground">Operations</span>
							</div>
							<ChevronsUpDownIcon class="ms-auto size-4" />
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.Header>
			<Sidebar.Content>
				<Sidebar.Group>
					<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
					<Sidebar.GroupContent>
						<Sidebar.Menu>
							{#each items as item (item.title)}
								<Sidebar.MenuItem>
									<Sidebar.MenuButton isActive={item.active} tooltipContent={item.title}>
										<item.icon />
										<span>{item.title}</span>
									</Sidebar.MenuButton>
								</Sidebar.MenuItem>
							{/each}
						</Sidebar.Menu>
					</Sidebar.GroupContent>
				</Sidebar.Group>
			</Sidebar.Content>
			<Sidebar.Footer>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton size="lg" tooltipContent="Alex Morgan" class="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground">
							<div class="bg-muted text-muted-foreground flex aspect-square size-8 items-center justify-center rounded-lg text-xs font-medium">
								AM
							</div>
							<div class="grid flex-1 text-start text-sm leading-tight">
								<span class="truncate font-medium">Alex Morgan</span>
								<span class="truncate text-xs text-muted-foreground">alex@acme.test</span>
							</div>
							<ChevronsUpDownIcon class="ms-auto size-4" />
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.Footer>
			<Sidebar.Rail />
		</Sidebar.Root>
		<Sidebar.Inset class="min-h-0 overflow-hidden">
			<header class="flex h-12 items-center gap-2 border-b px-4">
				<Sidebar.Trigger />
				<div class="flex min-w-0 flex-1 items-center justify-between gap-3">
					<span class="truncate text-sm font-medium">Dashboard</span>
					<span class="hidden text-xs text-muted-foreground sm:inline">
						{sidebar.open ? 'Expanded' : 'Collapsed'}
					</span>
				</div>
			</header>
			<div class="grid flex-1 content-start gap-3 overflow-auto p-4">
				<div class="grid gap-3 sm:grid-cols-3">
					<div class="rounded-md border p-3">
						<div class="text-xs text-muted-foreground">Revenue</div>
						<div class="mt-1 text-lg font-semibold">$24.8k</div>
					</div>
					<div class="rounded-md border p-3">
						<div class="text-xs text-muted-foreground">Orders</div>
						<div class="mt-1 text-lg font-semibold">1,284</div>
					</div>
					<div class="rounded-md border p-3">
						<div class="text-xs text-muted-foreground">Queue</div>
						<div class="mt-1 text-lg font-semibold">18</div>
					</div>
				</div>
				<div class="min-h-40 rounded-md border bg-muted/30"></div>
			</div>
		</Sidebar.Inset>
	{/snippet}
	</Sidebar.Provider>
</div>
