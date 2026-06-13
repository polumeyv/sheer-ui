<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { SelectContentProps } from "$lib/components/select/primitive/index.js";
	import { SelectContentState } from "$lib/components/select/primitive/select.svelte.js";
	import PopperLayer from "$lib/components/_shared/utilities/popper-layer/popper-layer.svelte";
	import PopperLayerForceMount from "$lib/components/_shared/utilities/popper-layer/popper-layer-force-mount.svelte";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		forceMount = false,
		side = "bottom",
		onInteractOutside = (() => {}),
		onEscapeKeydown = (() => {}),
		children,
		child,
		preventScroll = false,
		style,
		...restProps
	}: SelectContentProps = $props();

	const contentState = SelectContentState.create({
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
		ref={contentState.opts.ref}
		{side}
		enabled={contentState.root.opts.open.current}
		{id}
		{preventScroll}
		forceMount={true}
		shouldRender={contentState.shouldRender}
	>
		{#snippet popper({ props, wrapperProps })}
			{@const finalProps = mergeProps(props, { style: contentState.props.style }, { style })}
			{#if child}
				{@render child({ props: finalProps, wrapperProps, ...contentState.snippetProps })}
			{:else}
				<div {...wrapperProps}>
					<div {...finalProps}>
						{@render children?.()}
					</div>
				</div>
			{/if}
		{/snippet}
	</PopperLayerForceMount>
{:else if !forceMount}
	<PopperLayer
		{...mergedProps}
		{...contentState.popperProps}
		ref={contentState.opts.ref}
		{side}
		open={contentState.root.opts.open.current}
		{id}
		{preventScroll}
		forceMount={false}
		shouldRender={contentState.shouldRender}
	>
		{#snippet popper({ props, wrapperProps })}
			{@const finalProps = mergeProps(props, { style: contentState.props.style }, { style })}
			{#if child}
				{@render child({ props: finalProps, wrapperProps, ...contentState.snippetProps })}
			{:else}
				<div {...wrapperProps}>
					<div {...finalProps}>
						{@render children?.()}
					</div>
				</div>
			{/if}
		{/snippet}
	</PopperLayer>
{/if}
