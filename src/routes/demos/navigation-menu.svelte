<script lang="ts">
	import * as NavigationMenu from '$lib/components/navigation-menu/index';
	import CircleHelpIcon from '@lucide/svelte/icons/circle-help';
	import CircleIcon from '@lucide/svelte/icons/circle';
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';

	// Shared part styling, factored out so each example stays copy-paste sized.
	const LINK_ROW =
		'inline-flex h-9 items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground';
	const TITLE = 'font-medium';
	const DESC = 'text-muted-foreground';

	// 1 — components dropdown (with descriptions)
	const components = [
		{ title: 'Alert Dialog', description: 'A modal dialog that interrupts with important content.' },
		{ title: 'Hover Card', description: 'For sighted users to preview content behind a link.' },
		{ title: 'Progress', description: 'Displays an indicator showing task completion.' },
		{ title: 'Tabs', description: 'Layered sections of content shown one at a time.' }
	];

	// 4 — with icons
	const help = [
		{ title: 'Backlog', icon: CircleHelpIcon },
		{ title: 'To Do', icon: CircleIcon },
		{ title: 'Done', icon: CircleCheckIcon }
	];

	// 5 — controlled value
	const tabs = ['getting-started', 'components'];
	let active = $state('');
</script>

<div class="flex w-full max-w-3xl flex-col gap-10">
	<!-- 1 — default: triggers, links, descriptions -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Default</h3>
			<p class="text-muted-foreground mt-1 text-xs">Triggers, a plain link, and a grid of descriptions.</p>
		</div>
		<NavigationMenu.Root>
			<NavigationMenu.List>
				<NavigationMenu.Item>
					<NavigationMenu.Trigger>Components</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<ul class="grid w-[300px] gap-2 p-2">
							{#each components as component (component.title)}
								<li>
									<NavigationMenu.Link href="##">
										<div class={TITLE}>{component.title}</div>
										<div class={DESC}>{component.description}</div>
									</NavigationMenu.Link>
								</li>
							{/each}
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>

				<NavigationMenu.Item>
					<NavigationMenu.Link href="##" class={LINK_ROW}>Docs</NavigationMenu.Link>
				</NavigationMenu.Item>

				<NavigationMenu.Item>
					<NavigationMenu.Trigger>
						<CircleHelpIcon aria-hidden="true" />
						Help
					</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<ul class="grid w-[200px] gap-2 p-2">
							<li>
								<NavigationMenu.Link href="##">Documentation</NavigationMenu.Link>
							</li>
							<li>
								<NavigationMenu.Link href="##">Support</NavigationMenu.Link>
							</li>
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	</section>

	<!-- 2 — simple link list -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Simple</h3>
			<p class="text-muted-foreground mt-1 text-xs">A minimal dropdown of plain links.</p>
		</div>
		<NavigationMenu.Root>
			<NavigationMenu.List>
				<NavigationMenu.Item>
					<NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<ul class="grid w-[200px] gap-1 p-2">
							<li><NavigationMenu.Link href="##">Components</NavigationMenu.Link></li>
							<li><NavigationMenu.Link href="##">Documentation</NavigationMenu.Link></li>
							<li><NavigationMenu.Link href="##">Blocks</NavigationMenu.Link></li>
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	</section>

	<!-- 3 — with icons -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With icon</h3>
			<p class="text-muted-foreground mt-1 text-xs">Each link pairs a leading icon with its label.</p>
		</div>
		<NavigationMenu.Root>
			<NavigationMenu.List>
				<NavigationMenu.Item>
					<NavigationMenu.Trigger>Status</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<ul class="grid w-[200px] gap-1 p-2">
							{#each help as item (item.title)}
								{@const Icon = item.icon}
								<li>
									<NavigationMenu.Link href="##" class="flex-row items-center gap-2">
										<Icon aria-hidden="true" />
										{item.title}
									</NavigationMenu.Link>
								</li>
							{/each}
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	</section>

	<!-- 4 — without viewport -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Without viewport</h3>
			<p class="text-muted-foreground mt-1 text-xs">Content renders inline under each trigger.</p>
		</div>
		<NavigationMenu.Root viewport={false}>
			<NavigationMenu.List>
				<NavigationMenu.Item>
					<NavigationMenu.Trigger>Overview</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<ul class="grid w-[200px] gap-1 p-2">
							<li><NavigationMenu.Link href="##">Introduction</NavigationMenu.Link></li>
							<li><NavigationMenu.Link href="##">Installation</NavigationMenu.Link></li>
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Link href="##" class={LINK_ROW}>Changelog</NavigationMenu.Link>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	</section>

	<!-- 5 — controlled + disabled -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Controlled</h3>
			<p class="text-muted-foreground mt-1 text-xs">Bound open value, plus a disabled trigger.</p>
		</div>
		<NavigationMenu.Root bind:value={active}>
			<NavigationMenu.List>
				<NavigationMenu.Item value={tabs[0]}>
					<NavigationMenu.Trigger>Getting started</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<ul class="grid w-[200px] gap-1 p-2">
							<li><NavigationMenu.Link href="##">Quick start</NavigationMenu.Link></li>
							<li><NavigationMenu.Link href="##">Theming</NavigationMenu.Link></li>
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
				<NavigationMenu.Item value={tabs[1]}>
					<NavigationMenu.Trigger>Components</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<ul class="grid w-[200px] gap-1 p-2">
							<li><NavigationMenu.Link href="##">Buttons</NavigationMenu.Link></li>
							<li><NavigationMenu.Link href="##">Forms</NavigationMenu.Link></li>
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Trigger disabled>Soon</NavigationMenu.Trigger>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
		<p class="text-muted-foreground text-xs">Open: {active || 'none'}</p>
	</section>
</div>
