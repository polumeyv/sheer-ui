<script lang="ts">
	// SPIKE demo — the native <dialog> alternative to dialog-demo.svelte. Same surface, none of the
	// Dialog JS stack (PresenceManager / FocusScope / Escape + Dismissible layers / BodyScrollLock /
	// overlay div). `open` is the only state; everything else is native + CSS.
	import NativeDialog from '../../lib/internal/native-dialog/native-dialog.svelte';
	import { Button } from '../../lib/components/button/index.js';
	import { Input } from '../../lib/components/input/index.js';
	import { Label } from '../../lib/components/label/index.js';
	import X from '@lucide/svelte/icons/x';

	let open = $state(false);
</script>

<Button variant="outline" onclick={() => (open = true)}>Edit profile</Button>

<NativeDialog bind:open aria-labelledby="native-dialog-title" aria-describedby="native-dialog-desc">
	<div class="flex flex-col gap-1.5">
		<h2 id="native-dialog-title" class="text-lg leading-none font-semibold">Edit profile</h2>
		<p id="native-dialog-desc" class="text-muted-foreground text-sm">
			Make changes to your profile here. Click save when you're done.
		</p>
	</div>
	<div class="flex flex-col gap-2">
		<Label.Root for="native-dialog-name">Name</Label.Root>
		<Input id="native-dialog-name" value="Pedro Duarte" />
	</div>
	<div class="flex justify-end">
		<Button onclick={() => (open = false)}>Save changes</Button>
	</div>
	<button
		onclick={() => (open = false)}
		class="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden">
		<X class="size-4" />
		<span class="sr-only">Close</span>
	</button>
</NativeDialog>
