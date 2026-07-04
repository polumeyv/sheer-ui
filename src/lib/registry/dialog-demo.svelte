<script lang="ts">
	// `Dialog.Content` is a native <dialog> (showModal + ::backdrop) that bakes the shadcn modal
	// surface — a bare `<Dialog.Content>` is already a centered, dimmed modal. Consumers add a `class`
	// only to tweak (e.g. `max-w-md!`) and supply their own header/body/actions.
	import * as Dialog from "../components/dialog/index.js";
	import { Button } from "../components/button/index.js";
	import { Input } from "../components/input/index.js";
	import { Label } from "../components/label/index.js";
	import X from "@lucide/svelte/icons/x";
</script>

<Dialog.Root>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button variant="outline" {...props}>Edit profile</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content>
		<div class="flex flex-col gap-1.5">
			<Dialog.Title class="text-lg font-semibold leading-none">Edit profile</Dialog.Title>
			<Dialog.Description class="text-muted-foreground text-sm">
				Make changes to your profile here. Click save when you're done.
			</Dialog.Description>
		</div>
		<div class="flex flex-col gap-2">
			<Label.Root for="dialog-name">Name</Label.Root>
			<Input id="dialog-name" value="Pedro Duarte" />
		</div>
		<div class="flex justify-end">
			<Dialog.Close>
				{#snippet child({ props })}
					<Button {...props}>Save changes</Button>
				{/snippet}
			</Dialog.Close>
		</div>
		<Dialog.Close
			class="ring-offset-background focus:ring-ring absolute right-4 top-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-offset-2">
			<X class="size-4" />
			<span class="sr-only">Close</span>
		</Dialog.Close>
	</Dialog.Content>
</Dialog.Root>
