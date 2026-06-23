<script lang="ts">
	// `alert-dialog` bakes the styled Content surface, but its Overlay, Title and
	// Description come from the headless dialog primitive — so those get the
	// canonical shadcn Tailwind utilities inline (mirroring the dialog exemplar).
	import * as AlertDialog from '$lib/components/alert-dialog/index.js';
	import { Button } from '$lib/components/button/index.js';
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger>
		{#snippet child({ props })}
			<Button variant='outline' {...props}>Delete account</Button>
		{/snippet}
	</AlertDialog.Trigger>
	<AlertDialog.Portal>
		<AlertDialog.Overlay
			class='fixed inset-0 z-50 bg-black/80 transition-opacity data-[state=closed]:opacity-0 data-[state=open]:opacity-100' />
		<AlertDialog.Content>
			<div class='flex flex-col gap-2'>
				<AlertDialog.Title class='text-lg font-semibold'>Are you absolutely sure?</AlertDialog.Title>
				<AlertDialog.Description class='text-muted-foreground text-sm'>
					This action cannot be undone. This will permanently delete your account and remove your data
					from our servers.
				</AlertDialog.Description>
			</div>
			<div class='flex justify-end gap-2'>
				<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				<AlertDialog.Action>Continue</AlertDialog.Action>
			</div>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
