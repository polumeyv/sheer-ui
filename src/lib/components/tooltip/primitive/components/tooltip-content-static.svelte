<script lang="ts">
	import { mergeProps } from '$lib/vendor/index';
	import type { TooltipContentStaticProps } from '$lib/components/tooltip/primitive/index';
	import { TooltipContentState } from '$lib/components/tooltip/primitive/tooltip.svelte';
	import { createId } from '$lib/vendor/create-id';
	import PopperLayer from '$lib/components/_shared/utilities/popper-layer/popper-layer.svelte';
	import { getFloatingContentCSSVars } from '$lib/vendor/floating-svelte/floating-utils.svelte';

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
	{forceMount}
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
