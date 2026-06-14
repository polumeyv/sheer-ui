<script lang="ts">
	import * as Drawer from '$lib/components/drawer/index';
	import { Button, buttonVariants } from '$lib/components/button/index';
</script>

<Drawer.Root>
	<Drawer.Trigger class={buttonVariants({ variant: 'outline' })}>Open drawer</Drawer.Trigger>
	<Drawer.Content>
		<div class="mx-auto w-full max-w-sm">
			<Drawer.Header>
				<Drawer.Title>Move goal</Drawer.Title>
				<Drawer.Description>Set your daily activity target.</Drawer.Description>
			</Drawer.Header>
			<div class="flex items-center justify-center p-4">
				<span class="text-5xl font-bold tracking-tighter">350</span>
				<span class="text-muted-foreground ml-2 text-sm">cal / day</span>
			</div>
			<Drawer.Footer>
				<Button>Submit</Button>
				<Drawer.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Drawer.Close>
			</Drawer.Footer>
		</div>
	</Drawer.Content>
</Drawer.Root>
