<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { SelectContentStaticProps } from "$lib/components/primitive/combobox/index";
	import { SelectContentState } from "$lib/components/primitive/combobox/select.svelte";
	import PopperLayer from "$lib/components/_shared/utilities/popper-layer/popper-layer.svelte";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		forceMount = false,
		onInteractOutside = (() => {}),
		onEscapeKeydown = (() => {}),
		children,
		child,
		preventScroll = false,
		style,
		...restProps
	}: SelectContentStaticProps = $props();

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
	isStatic
	open={contentState.root.opts.open.current}
	{id}
	{preventScroll}
	{forceMount}
	shouldRender={contentState.shouldRender}
>
	{#snippet popper({ props })}
		{@const finalProps = mergeProps(props, { style: contentState.props.style }, { style })}
		{#if child}
			{@render child({ props: finalProps, ...contentState.snippetProps })}
		{:else}
			<div {...finalProps}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PopperLayer>
