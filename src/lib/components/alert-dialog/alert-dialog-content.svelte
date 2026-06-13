<script lang="ts">
	import { mergeProps } from '$lib/vendor/index.js';
	import type { AlertDialogContentProps } from '$lib/components/alert-dialog/primitive/index.js';
	import { DialogContentState } from '$lib/components/dialog/primitive/dialog.svelte.js';
	import DismissibleLayer from '$lib/components/_shared/utilities/dismissible-layer/dismissible-layer.svelte';
	import EscapeLayer from '$lib/components/_shared/utilities/escape-layer/escape-layer.svelte';
	import FocusScope from '$lib/components/_shared/utilities/focus-scope/focus-scope.svelte';
	import TextSelectionLayer from '$lib/components/_shared/utilities/text-selection-layer/text-selection-layer.svelte';
	import ScrollLock from '$lib/components/_shared/utilities/scroll-lock/scroll-lock.svelte';
	import { createId } from '$lib/internal/create-id.js';
	import AlertDialogPortal from './alert-dialog-portal.svelte';
	import AlertDialogOverlay from './alert-dialog-overlay.svelte';
	import { cn, type WithoutChild, type WithoutChildrenOrChild } from '../../vendor/utils';
	import type { ComponentProps } from 'svelte';

	const uid = $props.id();

	let {
		id = createId(uid),
		children,
		ref = $bindable(null),
		forceMount = false,
		interactOutsideBehavior = 'ignore',
		onCloseAutoFocus = (() => {}),
		onEscapeKeydown = (() => {}),
		onOpenAutoFocus = (() => {}),
		onInteractOutside = (() => {}),
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
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
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
				setTimeout(() => contentState.opts.ref.current?.focus(), 0);
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
