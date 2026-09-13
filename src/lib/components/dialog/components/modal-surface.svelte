<script lang="ts">
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import { DialogContentState } from '../dialog.svelte.js';
	import type { DialogContentProps } from '../types.js';
	import { createId } from '../../../internal/create-id.js';
	import { scrollLockAttachment } from '../../../internal/body-scroll-lock.svelte.js';
	import { nativeDialogControllerAttachment } from '../../../internal/native-dialog-controller.svelte.js';

	// Native dialogs own focus and the top layer; this surface adds dismissal policy, Tab wrapping,
	// and body scroll locking. Keep display utilities on adapter children so closed dialogs stay hidden.
	const uid = $props.id();

	let {
		id = createId(uid),
		children,
		child,
		ref = $bindable(null),
		outsideEvent = 'pointerdown',
		onEscapeKeydown = () => {},
		onInteractOutside = () => {},
		trapFocus = true,
		preventScroll = true,
		restoreScrollDelay = null,
		escapeKeydownBehavior = 'close',
		interactOutsideBehavior = 'close',
		...restProps
	}: DialogContentProps & {
		outsideEvent?: 'pointerdown' | 'click';
	} = $props();

	const contentState = DialogContentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	// The root alone reports settled animations; reporting here would double-fire completion.
	const controllerAttachment = nativeDialogControllerAttachment({
		open: () => contentState.root.cell.open,
		onClose: () => contentState.root.handleClose(),
		// the controller takes this as a plain, non-reactive value — fixed per adapter at mount
		// svelte-ignore state_referenced_locally
		outsideEvent,
		onInteractOutside: () => onInteractOutside,
		interactOutsideBehavior: () => interactOutsideBehavior,
		onEscapeKeydown: () => onEscapeKeydown,
		escapeKeydownBehavior: () => escapeKeydownBehavior,
		trapFocus: () => trapFocus,
	});

	// The <dialog> persists across open/close, so the lock gates on the cell's open, not element lifecycle.
	const scrollLock = scrollLockAttachment({
		enabled: () => contentState.root.cell.open && preventScroll,
		restoreScrollDelay: () => restoreScrollDelay,
	});

	const mergedProps = $derived(mergeProps({ 'data-modal-surface': '' }, restProps, contentState.props, scrollLock));
</script>

{#if child}
	{@render child({ props: mergeProps(mergedProps, controllerAttachment), ...contentState.snippetProps })}
{:else}
	<!-- DialogContentState.props / DialogContentProps are authored for a <div>; their generic event
	     handlers are typed to HTMLDivElement, so assert the merged set as dialog attributes. -->
	<dialog {...controllerAttachment} {...mergedProps as unknown as HTMLDialogAttributes}>
		{@render children?.()}
	</dialog>
{/if}
