<script lang="ts">
	import { boxWith, mergeProps } from "$lib/internal/toolbelt.js";
	import type { AlertDialogContentProps } from "../types.js";
	import DismissibleLayer from "../../utilities/dismissible-layer/dismissible-layer.svelte";
	import EscapeLayer from "../../utilities/escape-layer/escape-layer.svelte";
	import FocusScope from "../../utilities/focus-scope/focus-scope.svelte";
	import TextSelectionLayer from "../../utilities/text-selection-layer/text-selection-layer.svelte";
	import { createId } from "$lib/internal/create-id.js";
	import ScrollLock from "../../utilities/scroll-lock/scroll-lock.svelte";
	import { DialogContentState } from "$lib/components/dialog/dialog.svelte.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		children,
		child,
		ref = $bindable(null),
		forceMount = false,
		interactOutsideBehavior = "ignore",
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
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				"data-slot": "alert-dialog-content",
				class: "bg-background transition-[opacity,scale] starting:opacity-0 starting:scale-95 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 fixed inset-s-[50%] top-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
			},
			restProps,
			contentState.props
		)
	);
</script>

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
						{#if child}
							{#if contentState.root.opts.open.current}
								<ScrollLock {preventScroll} {restoreScrollDelay} />
							{/if}
							{@render child({
								props: mergeProps(mergedProps, focusScopeProps),
								...contentState.snippetProps,
							})}
						{:else}
							<ScrollLock {preventScroll} />
							<div {...mergeProps(mergedProps, focusScopeProps)}>
								{@render children?.()}
							</div>
						{/if}
					</TextSelectionLayer>
				</DismissibleLayer>
			</EscapeLayer>
		{/snippet}
	</FocusScope>
{/if}
