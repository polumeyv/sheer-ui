<script lang="ts">
	import * as NavigationMenu from '$lib/components/navigation-menu/index.js';
	import { navigationMenuTriggerStyle } from '$lib/components/navigation-menu/index.js';
</script>

<NavigationMenu.Root>
	<NavigationMenu.List>
		<NavigationMenu.Item>
			<NavigationMenu.Trigger>Getting started</NavigationMenu.Trigger>
			<NavigationMenu.Content>
				<ul class='grid w-[300px] gap-1 p-2'>
					<li>
						<NavigationMenu.Link href='##'>
							<div class='font-medium'>Introduction</div>
							<div class='text-muted-foreground'>Reusable components built with Svelte.</div>
						</NavigationMenu.Link>
					</li>
					<li>
						<NavigationMenu.Link href='##'>
							<div class='font-medium'>Installation</div>
							<div class='text-muted-foreground'>How to install dependencies.</div>
						</NavigationMenu.Link>
					</li>
				</ul>
			</NavigationMenu.Content>
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Link href='##' class={navigationMenuTriggerStyle()}>Docs</NavigationMenu.Link>
		</NavigationMenu.Item>
	</NavigationMenu.List>
</NavigationMenu.Root>
