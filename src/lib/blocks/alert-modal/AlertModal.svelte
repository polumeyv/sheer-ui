<script lang="ts">
	// Migrated off the bits AlertDialog stack onto the native <dialog> spike. Dropped: AlertDialog.Root
	// / Portal / Overlay / Content / Title / Description / Cancel / Action — and with them the
	// PresenceManager, FocusScope, escape + dismissible layers, BodyScrollLock and the JS overlay div.
	// Same `open` / `onOpenChange` contract, so the alertModal store is untouched.
	import NativeDialog from '../../internal/native-dialog/native-dialog.svelte';
	import { Button } from '../../components/button/index.js';
	import * as Field from '../../components/field';
	import { Root as Input } from '../../components/input';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import { beforeNavigate } from '$app/navigation';
	import { alertModal, VARIANT_DEFAULTS } from './alert-modal.svelte';

	const variantClasses: Record<string, string> = {
		destructive: 'bg-destructive! text-destructive-foreground! hover:bg-destructive/90!',
		warning: 'bg-warning! text-warning-foreground! hover:bg-warning/90!',
	};

	const titleClasses: Record<string, string> = {
		destructive: 'text-destructive',
	};

	// This block is mounted once in the app layout, so a navigation while the modal is open (e.g. a
	// programmatic redirect) would otherwise leave it open and scroll-locked on the next page. Close it on navigate
	beforeNavigate(() => {
		if (alertModal.open) alertModal.close();
	});

	// alertModal.close() nulls `options` synchronously, which would unmount the content mid-close and
	// collapse the dialog's height as it fades out. Latch the last-shown options so the content stays
	// mounted through the close animation; it refreshes on the next open. (Can't be $derived — the
	// whole point is to RETAIN the value after `options` goes null.)
	let shownOptions = $state(alertModal.options);
	$effect(() => {
		if (alertModal.options) shownOptions = alertModal.options;
	});
</script>

<NativeDialog
	open={alertModal.open}
	onOpenChange={(open) => {
		if (!open) alertModal.close();
	}}
	aria-labelledby="alert-modal-title"
	aria-describedby="alert-modal-desc">
	{#if shownOptions}
		<div class="flex flex-col gap-2 text-center sm:text-start">
			<h2 id="alert-modal-title" class="text-lg font-semibold {titleClasses[shownOptions.variant ?? ''] ?? ''}">
				{shownOptions.title}
			</h2>
			<p id="alert-modal-desc" class="text-muted-foreground text-sm">{shownOptions.description}</p>
		</div>

		{#if shownOptions.confirmText}
			<Field.Field>
				<Field.Label>Type "{shownOptions.confirmText}" to confirm</Field.Label>
				<Input bind:value={alertModal.confirmInput} placeholder={shownOptions.confirmText} />
			</Field.Field>
		{/if}

		{#if shownOptions.content}
			{@render shownOptions.content()}
		{/if}

		<div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
			<Button variant="outline" disabled={alertModal.loading} onclick={() => alertModal.close()}>
				{shownOptions.cancelLabel ?? 'Cancel'}
			</Button>
			<Button
				class={variantClasses[shownOptions.variant ?? ''] ?? ''}
				disabled={!alertModal.canConfirm}
				onclick={() => alertModal.handleConfirm()}>
				{#if alertModal.loading}<Loader2Icon class="size-4 animate-spin" />{/if}
				{shownOptions.actionLabel ?? VARIANT_DEFAULTS[shownOptions.variant ?? 'default']}
			</Button>
		</div>
	{/if}
</NativeDialog>
