<script lang="ts">
	import { afterSleep, boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { AlertDialogContentProps } from '$lib/bits/alert-dialog/types.js';
	import { DialogContentState } from '$lib/bits/dialog/dialog.svelte.js';
	import DismissibleLayer from '$lib/bits/utilities/dismissible-layer/dismissible-layer.svelte';
	import EscapeLayer from '$lib/bits/utilities/escape-layer/escape-layer.svelte';
	import FocusScope from '$lib/bits/utilities/focus-scope/focus-scope.svelte';
	import TextSelectionLayer from '$lib/bits/utilities/text-selection-layer/text-selection-layer.svelte';
	import ScrollLock from '$lib/bits/utilities/scroll-lock/scroll-lock.svelte';
	import { createId } from '$lib/internal/create-id.js';
	import { noop } from '$lib/internal/noop.js';
	import AlertDialogPortal from './alert-dialog-portal.svelte';
	import AlertDialogOverlay from './alert-dialog-overlay.svelte';
	import { cn, type WithoutChild, type WithoutChildrenOrChild } from '../../utils';
	import type { ComponentProps } from 'svelte';

	const uid = $props.id();

	let {
		id = createId(uid),
		children,
		ref = $bindable(null),
		forceMount = false,
		interactOutsideBehavior = 'ignore',
		onCloseAutoFocus = noop,
		onEscapeKeydown = noop,
		onOpenAutoFocus = noop,
		onInteractOutside = noop,
		preventScroll = true,
		trapFocus = true,
		restoreScrollDelay = null,
		class: className,
		portalProps,
		...restProps
	}: WithoutChild<AlertDialogContentProps> & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof AlertDialogPortal>>;
	} = $props();

	const contentState = DialogContentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'alert-dialog-content',
				class: cn(
					'bg-background transition-[opacity,scale] starting:opacity-0 starting:scale-95 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 fixed inset-s-[50%] top-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
					className
				),
			},
			restProps,
			contentState.props
		)
	);
</script>

<AlertDialogPortal {...portalProps}>
	<AlertDialogOverlay />
	{#if contentState.shouldRender || forceMount}
		<FocusScope
			ref={contentState.opts.ref}
			loop
			{trapFocus}
			enabled={contentState.root.opts.open.current}
			{onCloseAutoFocus}
			onOpenAutoFocus={(e) => {
				onOpenAutoFocus(e);
				if (e.defaultPrevented) return;
				e.preventDefault();
				afterSleep(0, () => contentState.opts.ref.current?.focus());
			}}
		>
			{#snippet focusScope({ props: focusScopeProps })}
				<EscapeLayer
					{...mergedProps}
					enabled={contentState.root.opts.open.current}
					ref={contentState.opts.ref}
					onEscapeKeydown={(e) => {
						onEscapeKeydown(e);
						if (e.defaultPrevented) return;
						contentState.root.handleClose();
					}}
				>
					<DismissibleLayer
						{...mergedProps}
						ref={contentState.opts.ref}
						enabled={contentState.root.opts.open.current}
						{interactOutsideBehavior}
						onInteractOutside={(e) => {
							onInteractOutside(e);
							if (e.defaultPrevented) return;
							contentState.root.handleClose();
						}}
					>
						<TextSelectionLayer
							{...mergedProps}
							ref={contentState.opts.ref}
							enabled={contentState.root.opts.open.current}
						>
							<ScrollLock {preventScroll} />
							<div {...mergeProps(mergedProps, focusScopeProps)}>
								{@render children?.()}
							</div>
						</TextSelectionLayer>
					</DismissibleLayer>
				</EscapeLayer>
			{/snippet}
		</FocusScope>
	{/if}
</AlertDialogPortal>
