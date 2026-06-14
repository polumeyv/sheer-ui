<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { SelectContentProps } from "$lib/components/combobox/primitive/index";
	import { SelectContentState } from "$lib/components/combobox/primitive/select.svelte";
	import PopperLayer from "$lib/components/_shared/utilities/popper-layer/popper-layer.svelte";
	import { createId } from "$lib/vendor/create-id";

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

<PopperLayer
	{...mergedProps}
	{...contentState.popperProps}
	ref={contentState.opts.ref}
	{side}
	open={contentState.root.opts.open.current}
	{id}
	{preventScroll}
	{forceMount}
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
