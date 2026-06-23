<script lang="ts">
	import { AlertDialog } from "$lib/components/alert-dialog";
	import * as Field from "$lib/components/field";
	import { Root as Input } from "$lib/components/input";
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
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
	<AlertDialog.Portal>
		<AlertDialog.Overlay class="transition-opacity starting:opacity-0 data-[state=closed]:opacity-0 fixed inset-0 z-50 bg-black/50" />
		<AlertDialog.Content>
			{#if alertModal.options}
				{const opts = alertModal.options}
				<div class="flex flex-col gap-2 text-center sm:text-start">
					<AlertDialog.Title class="text-lg font-semibold {titleClasses[opts.variant ?? ''] ?? ''}">
						{opts.title}
					</AlertDialog.Title>
					<AlertDialog.Description class="text-muted-foreground text-sm">{opts.description}</AlertDialog.Description>
				</div>

				{#if opts.confirmText}
					<Field.Field>
						<Field.Label>Type "{opts.confirmText}" to confirm</Field.Label>
						<Input bind:value={alertModal.confirmInput} placeholder={opts.confirmText} />
					</Field.Field>
				{/if}

				{#if opts.content}
					{@render opts.content()}
				{/if}

				<div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
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
						{#if alertModal.loading}<Loader2Icon class="size-4 animate-spin" />{/if}
						{alertModal.actionLabel}
					</AlertDialog.Action>
				</div>
			{/if}
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
