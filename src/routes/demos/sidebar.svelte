<script lang="ts">
	import * as Sidebar from '$lib/components/sidebar/index';
	import LayoutDashboardIcon from '@lucide/svelte/icons/layout-dashboard';
	import ShoppingCartIcon from '@lucide/svelte/icons/shopping-cart';
	import GlobeIcon from '@lucide/svelte/icons/globe';
	import UsersIcon from '@lucide/svelte/icons/users';
	import CalendarIcon from '@lucide/svelte/icons/calendar';

	const items = [
		{ title: 'Overview', icon: LayoutDashboardIcon, badge: undefined },
		{ title: 'Orders', icon: ShoppingCartIcon, badge: '12' },
		{ title: 'Domains', icon: GlobeIcon, badge: undefined },
		{ title: 'Team', icon: UsersIcon, badge: undefined },
		{ title: 'Calendar', icon: CalendarIcon, badge: undefined },
	];

	let active = $state('Overview');
</script>

<Sidebar.Provider class="min-h-0! w-full max-w-xs rounded-lg border">
	<Sidebar.Root collapsible="none" class="w-full rounded-lg">
		<Sidebar.Header>
			<Sidebar.GroupLabel>Acme Inc.</Sidebar.GroupLabel>
		</Sidebar.Header>
		<Sidebar.Content>
			<Sidebar.Group>
				<Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each items as item (item.title)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton
									isActive={active === item.title}
									onclick={() => (active = item.title)}>
									{#snippet child({ props })}
										<button type="button" {...props}>
											<item.icon />
											<span>{item.title}</span>
										</button>
									{/snippet}
								</Sidebar.MenuButton>
								{#if item.badge}
									<Sidebar.MenuBadge>{item.badge}</Sidebar.MenuBadge>
								{/if}
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		</Sidebar.Content>
		<Sidebar.Separator />
		<Sidebar.Footer>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton>
						<UsersIcon />
						<span>shadcn</span>
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Footer>
	</Sidebar.Root>
</Sidebar.Provider>
