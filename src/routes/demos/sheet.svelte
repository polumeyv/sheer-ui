<script lang="ts">
	import * as Sheet from '$lib/components/sheet/index';
	import { Button, buttonVariants } from '$lib/components/button/index';
	import { Input } from '$lib/components/input/index';
	import { Label } from '$lib/components/label/index';
</script>

<Sheet.Root>
	<Sheet.Trigger class={buttonVariants({ variant: 'outline' })}>Edit profile</Sheet.Trigger>
	<Sheet.Content>
		<Sheet.Header>
			<Sheet.Title>Edit profile</Sheet.Title>
			<Sheet.Description>
				Make changes to your profile here. Click save when you're done.
			</Sheet.Description>
		</Sheet.Header>
		<div class="grid flex-1 auto-rows-min gap-4 px-4">
			<div class="grid gap-2">
				<Label for="sheet-name">Name</Label>
				<Input id="sheet-name" value="Pedro Duarte" />
			</div>
			<div class="grid gap-2">
				<Label for="sheet-username">Username</Label>
				<Input id="sheet-username" value="@peduarte" />
			</div>
		</div>
		<Sheet.Footer>
			<Button type="submit">Save changes</Button>
			<Sheet.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
