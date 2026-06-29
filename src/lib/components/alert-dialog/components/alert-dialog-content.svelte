<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import type { AlertDialogContentProps } from '../types.js';
	import { interactOutsideAttachment } from '../../utilities/dismissible-layer/use-dismissable-layer.svelte.js';
	import { escapeKeydownAttachment } from '../../utilities/escape-layer/use-escape-layer.svelte.js';
	import { FocusScope } from '../../utilities/focus-scope/focus-scope.svelte.js';
	import { textSelectionAttachment } from '../../utilities/text-selection-layer/use-text-selection-layer.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import ScrollLock from '../../utilities/scroll-lock/scroll-lock.svelte';
	import { DialogContentState } from '$lib/components/dialog/dialog.svelte.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		children,
		child,
		ref = $bindable(null),
		forceMount = false,
		interactOutsideBehavior = 'ignore',
		onCloseAutoFocus = () => {},
		onEscapeKeydown = () => {},
		onOpenAutoFocus = () => {},
		onInteractOutside = () => {},
		preventScroll = true,
		trapFocus = true,
		restoreScrollDelay = null,
		...restProps
	}: AlertDialogContentProps = $props();

	const contentState = DialogContentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'alert-dialog-content',
				class:
					'bg-background transition-[opacity,scale] starting:opacity-0 starting:scale-95 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 fixed inset-s-[50%] top-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
			},
			restProps,
			contentState.props,
		),
	);

	const escapeAttachment = escapeKeydownAttachment({
		escapeKeydownBehavior: () => restProps.escapeKeydownBehavior ?? 'close',
		onEscapeKeydown: () => (e) => {
			onEscapeKeydown(e);
			if (e.defaultPrevented) return;
			contentState.root.handleClose();
		},
		enabled: () => contentState.root.opts.open.current,
	});

	// Alert-dialog content drops the dismissible focus-capture props (default-slot usage); only
	// `dismissible.attachment` is merged below.
	const dismissible = interactOutsideAttachment({
		id: () => id,
		interactOutsideBehavior: () => interactOutsideBehavior,
		onInteractOutside: () => (e) => {
			onInteractOutside(e);
			if (e.defaultPrevented) return;
			contentState.root.handleClose();
		},
		onFocusOutside: () => restProps.onFocusOutside ?? (() => {}),
		enabled: () => contentState.root.opts.open.current,
		isValidEvent: () => () => false,
	});

	const textSelection = textSelectionAttachment({
		id: () => id,
		onPointerDown: () => () => {},
		onPointerUp: () => () => {},
		enabled: () => contentState.root.opts.open.current && (restProps.preventOverflowTextSelection ?? true),
	});

	const focusScope = FocusScope.use({
		enabled: boxWith(() => contentState.root.opts.open.current),
		trap: boxWith(() => trapFocus),
		loop: true,
		onCloseAutoFocus: boxWith(() => onCloseAutoFocus),
		onOpenAutoFocus: boxWith(() => (e) => {
			onOpenAutoFocus(e);
			if (e.defaultPrevented) return;
			e.preventDefault();
			setTimeout(() => contentState.opts.ref.current?.focus(), 0);
		}),
		ref: contentState.opts.ref,
	});
</script>

{#if contentState.shouldRender || forceMount}
	{#if child}
		{#if contentState.root.opts.open.current}
			<ScrollLock {preventScroll} {restoreScrollDelay} />
		{/if}
		{@render child({
			props: mergeProps(mergedProps, focusScope.props, escapeAttachment, dismissible.attachment, textSelection),
			...contentState.snippetProps,
		})}
	{:else}
		<ScrollLock {preventScroll} />
		<div {...mergeProps(mergedProps, focusScope.props, escapeAttachment, dismissible.attachment, textSelection)}>
			{@render children?.()}
		</div>
	{/if}
{/if}
