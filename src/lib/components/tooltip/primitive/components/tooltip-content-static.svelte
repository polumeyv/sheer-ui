<script lang="ts">
	import { mergeProps } from '$lib/vendor/index.js';
	import type { TooltipContentStaticProps } from '$lib/components/tooltip/primitive/index.js';
	import { TooltipContentState } from '$lib/components/tooltip/primitive/tooltip.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import PopperLayer from '$lib/components/_shared/utilities/popper-layer/popper-layer.svelte';
	import { getFloatingContentCSSVars } from '$lib/internal/floating-svelte/floating-utils.svelte.js';
	import PopperLayerForceMount from '$lib/components/_shared/utilities/popper-layer/popper-layer-force-mount.svelte';

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
	}: TooltipContentStaticProps = $props();

	const contentState = TooltipContentState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		onInteractOutside: { get current() { return onInteractOutside; } },
		onEscapeKeydown: { get current() { return onEscapeKeydown; } },
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

{#if forceMount}
	<PopperLayerForceMount
		{...mergedProps}
		{...contentState.popperProps}
		isStatic
		enabled={contentState.root.opts.open.current}
		{id}
		trapFocus={false}
		loop={false}
		preventScroll={false}
		forceMount={true}
		ref={contentState.opts.ref}
		tooltip={true}
		shouldRender={contentState.shouldRender}>
		{#snippet popper({ props })}
			{@const finalProps = mergeProps(props, { style: getFloatingContentCSSVars('tooltip') }, { style })}
			{#if child}
				{@render child({ props: finalProps, ...contentState.snippetProps })}
			{:else}
				<div {...finalProps}>
					{@render children?.()}
				</div>
			{/if}
		{/snippet}
	</PopperLayerForceMount>
{:else if !forceMount}
	<PopperLayer
		{...mergedProps}
		{...contentState.popperProps}
		tooltip={true}
		isStatic
		open={contentState.root.opts.open.current}
		{id}
		trapFocus={false}
		loop={false}
		preventScroll={false}
		forceMount={false}
		ref={contentState.opts.ref}
		shouldRender={contentState.shouldRender}>
		{#snippet popper({ props })}
			{@const finalProps = mergeProps(props, { style: getFloatingContentCSSVars('tooltip') }, { style })}
			{#if child}
				{@render child({ props: finalProps, ...contentState.snippetProps })}
			{:else}
				<div {...finalProps}>
					{@render children?.()}
				</div>
			{/if}
		{/snippet}
	</PopperLayer>
{/if}
