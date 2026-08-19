<script lang="ts">
	// Showcase for the alert-modal block: the real <AlertModal /> singleton driven by its store.
	import AlertModal from '#lib/blocks/alert-modal/AlertModal.svelte';
	import { alertModal } from '#lib/blocks/alert-modal/alert-modal.svelte.js';
	import { Button } from '#lib/components/button/index.js';
</script>

<div class="flex flex-wrap gap-2">
	<Button
		variant="outline"
		onclick={() =>
			alertModal.show({
				title: 'Heads up',
				description: 'A plain acknowledgement dialog — confirming just closes it.',
			})}>
		Acknowledge
	</Button>
	<Button
		variant="outline"
		onclick={() =>
			alertModal.warning({
				title: 'Continue without saving?',
				description: 'Your unsaved changes will be lost if you continue.',
			})}>
		Warning
	</Button>
	<Button
		variant="outline"
		onclick={() =>
			alertModal.destructive({
				title: 'Delete project?',
				description: 'This permanently removes the project and all of its data.',
				confirmText: 'delete',
				onConfirm: () => new Promise((resolve) => setTimeout(resolve, 800)),
			})}>
		Destructive (type to confirm)
	</Button>
</div>

<AlertModal />
