<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import type { MenuContentStaticProps } from '../types.js';
	import { MenuContentState } from '../menu.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import PopperLayer from '$lib/components/utilities/popper-layer/popper-layer.svelte';
	import { getFloatingContentCSSVars } from '$lib/internal/floating-svelte/floating-utils.svelte.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		child,
		children,
		ref = $bindable(null),
		loop = true,
		onInteractOutside = () => {},
		onEscapeKeydown = () => {},
		onCloseAutoFocus: onCloseAutoFocusProp = () => {},
		forceMount = false,
		style,
		...restProps
	}: MenuContentStaticProps = $props();

	const contentState = MenuContentState.create({
		id: boxWith(() => id),
		loop: boxWith(() => loop),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		onCloseAutoFocus: boxWith(() => onCloseAutoFocusProp),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'menubar-content',
				class:
					'bg-popover text-popover-foreground transition-[opacity,scale,translate] starting:opacity-0 starting:scale-95 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data-[side=bottom]:starting:-translate-y-2 data-[side=top]:starting:translate-y-2 data-[side=left]:starting:translate-x-2 data-[side=right]:starting:-translate-x-2 z-50 min-w-[12rem] origin-(--bits-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-md',
			},
			restProps,
			contentState.props,
			{
				style: { outline: 'none' },
			},
		),
	);

	function handleInteractOutside(e: PointerEvent) {
		onInteractOutside(e);
		if (e.defaultPrevented) return;
		contentState.parentMenu.onClose();
	}

	function handleEscapeKeydown(e: KeyboardEvent) {
		onEscapeKeydown(e);
		if (e.defaultPrevented) return;
		contentState.parentMenu.onClose();
	}
</script>

<PopperLayer
	{...mergedProps}
	{...contentState.popperProps}
	ref={contentState.opts.ref}
	open={contentState.parentMenu.opts.open.current}
	onInteractOutside={handleInteractOutside}
	onEscapeKeydown={handleEscapeKeydown}
	trapFocus
	{loop}
	{forceMount}
	isStatic
	{id}
	shouldRender={contentState.shouldRender}>
	{#snippet popper({ props })}
		{@const finalProps = mergeProps(props, { style: { outline: 'none', ...getFloatingContentCSSVars('menu') } }, { style })}
		{#if child}
			{@render child({ props: finalProps, ...contentState.snippetProps })}
		{:else}
			<div {...finalProps}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PopperLayer>
