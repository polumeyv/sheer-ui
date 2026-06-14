<script lang="ts">
	import * as NavigationMenu from '$lib/components/navigation-menu/index';
	import CircleHelpIcon from '@lucide/svelte/icons/circle-help';

	const components = [
		{ title: 'Alert Dialog', description: 'A modal dialog that interrupts with important content.' },
		{ title: 'Hover Card', description: 'For sighted users to preview content behind a link.' },
		{ title: 'Progress', description: 'Displays an indicator showing task completion.' },
		{ title: 'Tabs', description: 'Layered sections of content shown one at a time.' }
	];
</script>

<NavigationMenu.Root>
	<NavigationMenu.List>
		<NavigationMenu.Item>
			<NavigationMenu.Trigger>Components</NavigationMenu.Trigger>
			<NavigationMenu.Content>
				<ul class="grid w-[300px] gap-2 p-2">
					{#each components as component (component.title)}
						<li>
							<NavigationMenu.Link href="##">
								<div class="font-medium">{component.title}</div>
								<div class="text-muted-foreground">{component.description}</div>
							</NavigationMenu.Link>
						</li>
					{/each}
				</ul>
			</NavigationMenu.Content>
		</NavigationMenu.Item>

		<NavigationMenu.Item>
			<NavigationMenu.Link
				href="##"
				class="inline-flex h-9 items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
			>
				Docs
			</NavigationMenu.Link>
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
