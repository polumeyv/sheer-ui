<script lang="ts">
	import { boxWith, mountedAttachment } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import type { LinkPreviewContentStaticProps } from '../types.js';
	import { LinkPreviewContentState } from '../link-preview.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import PopperLayer from '$lib/components/utilities/popper-layer/popper-layer.svelte';
	import { getFloatingContentCSSVars } from '$lib/internal/floating-svelte/floating-utils.svelte.js';

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		onInteractOutside = () => {},
		onEscapeKeydown = () => {},
		forceMount = false,
		style,
		...restProps
	}: LinkPreviewContentStaticProps = $props();

	const contentState = LinkPreviewContentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		onInteractOutside: boxWith(() => onInteractOutside),
		onEscapeKeydown: boxWith(() => onEscapeKeydown),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'hover-card-content',
				class:
					'bg-popover text-popover-foreground transition-[opacity,scale,translate] starting:opacity-0 starting:scale-95 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data-[side=bottom]:starting:-translate-y-2 data-[side=top]:starting:translate-y-2 data-[side=left]:starting:translate-x-2 data-[side=right]:starting:-translate-x-2 z-50 mt-3 w-64 rounded-md border p-4 shadow-md outline-none',
			},
			restProps,
			contentState.props,
		),
	);

	const mounted = mountedAttachment<HTMLElement>((m) => (contentState.root.contentMounted = m));
</script>

<PopperLayer
	{...mergedProps}
	{...contentState.popperProps}
	ref={contentState.opts.ref}
	open={contentState.root.opts.open.current}
	isStatic
	{id}
	trapFocus={false}
	loop={false}
	preventScroll={false}
	{forceMount}
	shouldRender={contentState.shouldRender}>
	{#snippet popper({ props })}
		{@const finalProps = mergeProps(props, { style: getFloatingContentCSSVars('link-preview') }, { style }, mounted)}
		{#if child}
			{@render child({ props: finalProps, ...contentState.snippetProps })}
		{:else}
			<div {...finalProps}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PopperLayer>
