<script lang="ts">
	import * as AlertDialog from '../../components/alert-dialog';
	import * as Field from '../../components/field';
	import { Root as Input } from '../../components/input';
	import { Spinner } from '../../components/spinner';
	import { alertModal } from './alert-modal.svelte';

	const variantClasses: Record<string, string> = {
		destructive: 'bg-destructive! text-destructive-foreground! hover:bg-destructive/90!',
		warning: 'bg-warning! text-warning-foreground! hover:bg-warning/90!',
	};

	const titleClasses: Record<string, string> = {
		destructive: 'text-destructive',
	};
</script>

<AlertDialog.Root
	open={alertModal.open}
	onOpenChange={(open) => { if (!open) alertModal.close(); }}
>
	<AlertDialog.Content>
		{#if alertModal.options}
			{const opts = alertModal.options}
			<AlertDialog.Header>
				<AlertDialog.Title class={titleClasses[opts.variant ?? ''] ?? ''}>
					{opts.title}
				</AlertDialog.Title>
				<AlertDialog.Description>{opts.description}</AlertDialog.Description>
			</AlertDialog.Header>

			{#if opts.confirmText}
				<Field.Field>
					<Field.Label>Type "{opts.confirmText}" to confirm</Field.Label>
					<Input bind:value={alertModal.confirmInput} placeholder={opts.confirmText} />
				</Field.Field>
			{/if}

			{#if opts.content}
				{@render opts.content()}
			{/if}

			<AlertDialog.Footer>
				<AlertDialog.Cancel disabled={alertModal.loading}>
					{opts.cancelLabel ?? 'Cancel'}
				</AlertDialog.Cancel>
				<AlertDialog.Action
					class={variantClasses[opts.variant ?? ''] ?? ''}
					disabled={!alertModal.canConfirm}
					onclick={(e: MouseEvent) => {
						e.preventDefault();
						alertModal.handleConfirm();
					}}
				>
					{#if alertModal.loading}<Spinner />{/if}
				</AlertDialog.Action>
			</AlertDialog.Footer>
		{/if}
	</AlertDialog.Content>
</AlertDialog.Root>
