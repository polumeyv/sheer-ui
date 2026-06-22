<script lang="ts" module>
	export const title = 'Left side';
</script>

<script lang="ts">
	import * as Sheet from '$lib/components/sheet/index.js';
	import { Button } from '$lib/components/button/index.js';
</script>

<Sheet.Root>
	<Sheet.Trigger>
		{#snippet child({ props })}
			<Button variant='outline' {...props}>Open left</Button>
		{/snippet}
	</Sheet.Trigger>
	<Sheet.Content side='left'>
		<Sheet.Header>
			<Sheet.Title>Navigation</Sheet.Title>
			<Sheet.Description>Jump to a section of the app.</Sheet.Description>
		</Sheet.Header>
		<nav class='grid gap-1 px-4 text-sm'>
			<a href='##' class='hover:bg-accent rounded-md px-2 py-1.5'>Dashboard</a>
			<a href='##' class='hover:bg-accent rounded-md px-2 py-1.5'>Projects</a>
			<a href='##' class='hover:bg-accent rounded-md px-2 py-1.5'>Settings</a>
		</nav>
	</Sheet.Content>
</Sheet.Root>
