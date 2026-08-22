<script lang="ts">
	import * as NavigationMenu from '../../src/lib/components/navigation-menu/index.js';

	let { viewport = false }: { viewport?: boolean } = $props();
</script>

<NavigationMenu.Root {viewport}>
	<NavigationMenu.List>
		<NavigationMenu.Item value="one">
			<NavigationMenu.Trigger openOnHover={false} data-testid="trigger">One</NavigationMenu.Trigger>
			<NavigationMenu.Content>
				{#snippet child({ props, open })}
					{#if open}
						<div {...props} data-testid="content">content one</div>
					{/if}
				{/snippet}
			</NavigationMenu.Content>
		</NavigationMenu.Item>
	</NavigationMenu.List>
	{#if viewport}
		<NavigationMenu.Viewport>
			{#snippet child({ props, open })}
				{#if open}
					<div {...props} data-testid="viewport"></div>
				{/if}
			{/snippet}
		</NavigationMenu.Viewport>
	{/if}
</NavigationMenu.Root>
