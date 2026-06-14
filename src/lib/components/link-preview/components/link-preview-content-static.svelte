<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { LinkPreviewContentStaticProps } from "$lib/components/link-preview/index";
	import { LinkPreviewContentState } from "$lib/components/link-preview/link-preview.svelte";
	import { createId } from "$lib/vendor/create-id";
	import PopperLayer from "$lib/components/_shared/utilities/popper-layer/popper-layer.svelte";
	import { getFloatingContentCSSVars } from "$lib/vendor/floating-svelte/floating-utils.svelte";
	import Mounted from "$lib/components/_shared/utilities/mounted.svelte";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		onInteractOutside = (() => {}),
		onEscapeKeydown = (() => {}),
		forceMount = false,
		style,
		...restProps
	}: LinkPreviewContentStaticProps = $props();

	const contentState = LinkPreviewContentState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		onInteractOutside: { get current() { return onInteractOutside; } },
		onEscapeKeydown: { get current() { return onEscapeKeydown; } },
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
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
	shouldRender={contentState.shouldRender}
>
	{#snippet popper({ props })}
		{@const finalProps = mergeProps(
			props,
			{ style: getFloatingContentCSSVars("link-preview") },
			{ style }
		)}
		{#if child}
			{@render child({ props: finalProps, ...contentState.snippetProps })}
		{:else}
			<div {...finalProps}>
				{@render children?.()}
			</div>
		{/if}
		{#if forceMount}
			<Mounted bind:mounted={contentState.root.contentMounted} />
		{/if}
	{/snippet}
</PopperLayer>
