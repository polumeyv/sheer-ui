<script lang="ts">
	import * as Sidebar from '$lib/components/sidebar/index';
	import LayoutDashboardIcon from '@lucide/svelte/icons/layout-dashboard';
	import ShoppingCartIcon from '@lucide/svelte/icons/shopping-cart';
	import GlobeIcon from '@lucide/svelte/icons/globe';
	import UsersIcon from '@lucide/svelte/icons/users';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import SearchIcon from '@lucide/svelte/icons/search';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import XIcon from '@lucide/svelte/icons/x';

	// Shared Provider/Root chrome, factored out so each example stays copy-paste sized.
	const PROVIDER = 'min-h-0! w-full max-w-xs rounded-lg border';
	const ROOT = 'w-full rounded-lg';

	// 1 — platform menu (active state + badges)
	const platform = [
		{ title: 'Overview', icon: LayoutDashboardIcon, badge: undefined },
		{ title: 'Orders', icon: ShoppingCartIcon, badge: '12' },
		{ title: 'Domains', icon: GlobeIcon, badge: undefined },
		{ title: 'Team', icon: UsersIcon, badge: undefined },
		{ title: 'Calendar', icon: CalendarIcon, badge: undefined },
	];
	let active = $state('Overview');

	// 2 — nested navigation (collapsible-style submenu)
	const nav = [
		{
			title: 'Components',
			icon: LayoutDashboardIcon,
			items: ['Accordion', 'Button', 'Dialog', 'Tooltip'],
		},
		{
			title: 'Settings',
			icon: SettingsIcon,
			items: ['Profile', 'Billing', 'Notifications'],
		},
	];
	let activeSub = $state('Button');

	// 3 — search input + loading skeleton
	const docs = ['Installation', 'Theming', 'Dark mode', 'CLI', 'Components'];
	let query = $state('');
	let loading = $state(false);
	const results = $derived(
		docs.filter((d) => d.toLowerCase().includes(query.trim().toLowerCase())),
	);

	// 4 — group + per-item actions
	let projects = $state(['Design Engineering', 'Sales & Marketing', 'Travel']);
	let next = $state(1);
	function addProject() {
		projects = [...projects, `Project ${next++}`];
	}
	function removeProject(name: string) {
		projects = projects.filter((p) => p !== name);
	}
</script>

<div class="flex w-full max-w-xl flex-col gap-10">
	<!-- 1 — platform menu -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Menu with badges</h3>
			<p class="text-muted-foreground mt-1 text-xs">Active item, leading icons and a count badge.</p>
		</div>
		<Sidebar.Provider class={PROVIDER}>
			<Sidebar.Root collapsible="none" class={ROOT}>
				<Sidebar.Header>
					<Sidebar.GroupLabel>Acme Inc.</Sidebar.GroupLabel>
				</Sidebar.Header>
				<Sidebar.Content>
					<Sidebar.Group>
						<Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
						<Sidebar.GroupContent>
							<Sidebar.Menu>
								{#each platform as item (item.title)}
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
	</section>

	<!-- 2 — nested navigation -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Nested submenus</h3>
			<p class="text-muted-foreground mt-1 text-xs">MenuSub with selectable sub-items.</p>
		</div>
		<Sidebar.Provider class={PROVIDER}>
			<Sidebar.Root collapsible="none" class={ROOT}>
				<Sidebar.Content>
					<Sidebar.Group>
						<Sidebar.GroupLabel>Documentation</Sidebar.GroupLabel>
						<Sidebar.GroupContent>
							<Sidebar.Menu>
								{#each nav as group (group.title)}
									<Sidebar.MenuItem>
										<Sidebar.MenuButton>
											<group.icon />
											<span>{group.title}</span>
										</Sidebar.MenuButton>
										<Sidebar.MenuSub>
											{#each group.items as item (item)}
												<Sidebar.MenuSubItem>
													<Sidebar.MenuSubButton
														isActive={activeSub === item}>
														{#snippet child({ props })}
															<button
																type="button"
																{...props}
																onclick={() => (activeSub = item)}>
																<span>{item}</span>
															</button>
														{/snippet}
													</Sidebar.MenuSubButton>
												</Sidebar.MenuSubItem>
											{/each}
										</Sidebar.MenuSub>
									</Sidebar.MenuItem>
								{/each}
							</Sidebar.Menu>
						</Sidebar.GroupContent>
					</Sidebar.Group>
				</Sidebar.Content>
			</Sidebar.Root>
		</Sidebar.Provider>
	</section>

	<!-- 3 — search input + skeleton -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Search & loading</h3>
			<p class="text-muted-foreground mt-1 text-xs">SidebarInput filter, with a skeleton loading state.</p>
		</div>
		<Sidebar.Provider class={PROVIDER}>
			<Sidebar.Root collapsible="none" class={ROOT}>
				<Sidebar.Header>
					<Sidebar.Group class="py-0">
						<Sidebar.GroupContent class="relative">
							<SearchIcon class="text-muted-foreground pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2" />
							<Sidebar.Input
								bind:value={query}
								placeholder="Search the docs…"
								aria-label="Search the docs"
								class="pl-8" />
						</Sidebar.GroupContent>
					</Sidebar.Group>
				</Sidebar.Header>
				<Sidebar.Content>
					<Sidebar.Group>
						<Sidebar.GroupLabel>Pages</Sidebar.GroupLabel>
						<Sidebar.GroupContent>
							<Sidebar.Menu>
								{#if loading}
									{#each ['a', 'b', 'c', 'd'] as key (key)}
										<Sidebar.MenuItem>
											<Sidebar.MenuSkeleton showIcon />
										</Sidebar.MenuItem>
									{/each}
								{:else}
									{#each results as page (page)}
										<Sidebar.MenuItem>
											<Sidebar.MenuButton>
												<GlobeIcon />
												<span>{page}</span>
											</Sidebar.MenuButton>
										</Sidebar.MenuItem>
									{/each}
								{/if}
							</Sidebar.Menu>
						</Sidebar.GroupContent>
					</Sidebar.Group>
				</Sidebar.Content>
				<Sidebar.Separator />
				<Sidebar.Footer>
					<button
						type="button"
						class="text-muted-foreground hover:text-foreground px-2 text-xs"
						onclick={() => (loading = !loading)}>
						{loading ? 'Show results' : 'Show skeleton'}
					</button>
				</Sidebar.Footer>
			</Sidebar.Root>
		</Sidebar.Provider>
	</section>

	<!-- 4 — group + menu actions -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Group & menu actions</h3>
			<p class="text-muted-foreground mt-1 text-xs">GroupAction adds, MenuAction removes per item.</p>
		</div>
		<Sidebar.Provider class={PROVIDER}>
			<Sidebar.Root collapsible="none" class={ROOT}>
				<Sidebar.Content>
					<Sidebar.Group>
						<Sidebar.GroupLabel>Projects</Sidebar.GroupLabel>
						<Sidebar.GroupAction title="Add project" onclick={addProject}>
							<PlusIcon />
							<span class="sr-only">Add project</span>
						</Sidebar.GroupAction>
						<Sidebar.GroupContent>
							<Sidebar.Menu>
								{#each projects as project (project)}
									<Sidebar.MenuItem>
										<Sidebar.MenuButton>
											<GlobeIcon />
											<span>{project}</span>
										</Sidebar.MenuButton>
										<Sidebar.MenuAction
											showOnHover
											onclick={() => removeProject(project)}>
											<XIcon />
											<span class="sr-only">Remove {project}</span>
										</Sidebar.MenuAction>
									</Sidebar.MenuItem>
								{:else}
									<p class="text-muted-foreground px-2 py-1.5 text-xs">No projects yet.</p>
								{/each}
							</Sidebar.Menu>
						</Sidebar.GroupContent>
					</Sidebar.Group>
				</Sidebar.Content>
			</Sidebar.Root>
		</Sidebar.Provider>
	</section>
</div>
