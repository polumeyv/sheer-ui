<script lang="ts">
	import * as Dialog from '$lib/components/dialog/index';
	import { Button, buttonVariants } from '$lib/components/button/index';
	import { Input } from '$lib/components/input/index';
	import { Label } from '$lib/components/label/index';
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Edit profile</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Edit profile</Dialog.Title>
			<Dialog.Description>
				Make changes to your profile here. Click save when you're done.
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-2 py-2">
			<Label for="profile-name">Name</Label>
			<Input id="profile-name" placeholder="Your name" />
		</div>
		<Dialog.Footer>
			<Button type="submit">Save changes</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
