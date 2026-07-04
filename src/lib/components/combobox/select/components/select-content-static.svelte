<script lang="ts">
	import { boxWith } from '../../../../internal/tools/index.js';
	import { mergeProps } from '../../../../merge-props.js';
	import type { SelectContentStaticProps } from '../types.js';
	import { SelectContentState } from '../select.svelte.js';
	import PopperLayer from '../../../utilities/popper-layer/popper-layer.svelte';
	import { createId } from '../../../../internal/create-id.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		forceMount = false,
		onInteractOutside = () => {},
		onEscapeKeydown = () => {},
		children,
		child,
		preventScroll = false,
		style,
		...restProps
	}: SelectContentStaticProps = $props();

	const contentState = SelectContentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		onInteractOutside: boxWith(() => onInteractOutside),
		onEscapeKeydown: boxWith(() => onEscapeKeydown),
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
	shouldRender={contentState.shouldRender}>
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
