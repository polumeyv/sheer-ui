<script lang="ts" module>
	export const title = 'Floating sidebar';
</script>

<script lang="ts">
	import * as Sidebar from '../../lib/components/sidebar/index.js';
	import ActivityIcon from '@lucide/svelte/icons/activity';
	import BellIcon from '@lucide/svelte/icons/bell';
	import CreditCardIcon from '@lucide/svelte/icons/credit-card';
	import FileTextIcon from '@lucide/svelte/icons/file-text';
	import LifeBuoyIcon from '@lucide/svelte/icons/life-buoy';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';


	const items = [
		{ title: 'Activity', icon: ActivityIcon, active: true },
		{ title: 'Invoices', icon: FileTextIcon },
		{ title: 'Billing', icon: CreditCardIcon },
		{ title: 'Alerts', icon: BellIcon },
		{ title: 'Support', icon: LifeBuoyIcon },
	];
</script>

<div class="relative isolate h-112 w-full overflow-hidden rounded-lg border bg-background transform-gpu">
	<Sidebar.Provider open class="relative min-h-0! h-full overflow-hidden" style="--sidebar-width: 13rem;">
		{#snippet children(sidebar)}
		<Sidebar.Root variant="floating" collapsible="icon" class="absolute! h-full!">
			<Sidebar.Header>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton size="lg" tooltipContent="Finance" class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
							<div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
								F
							</div>
							<div class="grid flex-1 text-start text-sm leading-tight">
								<span class="truncate font-medium">Finance</span>
								<span class="truncate text-xs text-muted-foreground">Workspace</span>
							</div>
							<ChevronsUpDownIcon class="ms-auto size-4" />
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.Header>
			<Sidebar.Content>
				<Sidebar.Group>
					<Sidebar.GroupLabel>Workspace</Sidebar.GroupLabel>
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
			<Sidebar.Rail />
		</Sidebar.Root>
		<Sidebar.Inset class="min-h-0 overflow-hidden">
			<header class="flex h-12 items-center gap-2 border-b px-4">
				<Sidebar.Trigger />
				<span class="truncate text-sm font-medium">Finance Overview</span>
				<span class="ml-auto hidden text-xs text-muted-foreground sm:inline">
					{sidebar.open ? 'Expanded' : 'Collapsed'}
				</span>
			</header>
			<div class="grid flex-1 gap-3 overflow-auto p-4">
				<div class="grid gap-3 sm:grid-cols-2">
					<div class="rounded-md border p-3">
						<div class="text-xs text-muted-foreground">Cash balance</div>
						<div class="mt-1 text-xl font-semibold">$82.4k</div>
					</div>
					<div class="rounded-md border p-3">
						<div class="text-xs text-muted-foreground">Pending invoices</div>
						<div class="mt-1 text-xl font-semibold">14</div>
					</div>
				</div>
				<div class="rounded-md border p-4">
					<div class="h-3 w-1/2 rounded bg-muted"></div>
					<div class="mt-3 h-3 w-5/6 rounded bg-muted"></div>
					<div class="mt-3 h-3 w-2/3 rounded bg-muted"></div>
				</div>
			</div>
		</Sidebar.Inset>
	{/snippet}
	</Sidebar.Provider>
</div>
