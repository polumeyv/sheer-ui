<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { AlertDialogContentProps } from "$lib/components/alert-dialog/primitive/index";
	import DismissibleLayer from "$lib/components/_shared/utilities/dismissible-layer/dismissible-layer.svelte";
	import EscapeLayer from "$lib/components/_shared/utilities/escape-layer/escape-layer.svelte";
	import FocusScope from "$lib/components/_shared/utilities/focus-scope/focus-scope.svelte";
	import TextSelectionLayer from "$lib/components/_shared/utilities/text-selection-layer/text-selection-layer.svelte";
	import { createId } from "$lib/vendor/create-id";
	import ScrollLock from "$lib/components/_shared/utilities/scroll-lock/scroll-lock.svelte";
	import { DialogContentState } from "$lib/components/dialog/primitive/dialog.svelte";

	const uid = $props.id();

	let {
		id = createId(uid),
		children,
		child,
		ref = $bindable(null),
		forceMount = false,
		interactOutsideBehavior = "ignore",
		onCloseAutoFocus = (() => {}),
		onEscapeKeydown = (() => {}),
		onOpenAutoFocus = (() => {}),
		onInteractOutside = (() => {}),
		preventScroll = true,
		trapFocus = true,
		restoreScrollDelay = null,
		...restProps
	}: AlertDialogContentProps = $props();

	const contentState = DialogContentState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
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
