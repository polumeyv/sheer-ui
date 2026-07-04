<script lang="ts">
	import * as Drawer from '../components/drawer/index.js';
	import { Button } from '../components/button/index.js';
</script>

<Drawer.Root>
	<Drawer.Trigger>
		{#snippet child({ props })}
			<Button variant='outline' {...props}>Open drawer</Button>
		{/snippet}
	</Drawer.Trigger>
	<Drawer.Content>
		<div class='mx-auto w-full max-w-sm'>
			<Drawer.Header>
				<Drawer.Title>Move goal</Drawer.Title>
				<Drawer.Description>Set your daily activity goal.</Drawer.Description>
			</Drawer.Header>
			<div class='flex items-center justify-center p-4'>
				<span class='text-7xl font-bold tracking-tighter'>350</span>
				<span class='text-muted-foreground ms-2 text-sm'>cal / day</span>
			</div>
			<Drawer.Footer>
				<Button>Submit</Button>
				<Drawer.Close>
					{#snippet child({ props })}
						<Button variant='outline' {...props}>Cancel</Button>
					{/snippet}
				</Drawer.Close>
			</Drawer.Footer>
		</div>
	</Drawer.Content>
</Drawer.Root>
