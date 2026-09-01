<script lang="ts">
	import { boxWith } from '../../../../internal/tools/index.js';
	import { mergeProps } from '../../../../internal/merge-props.js';
	import type { SelectContentStaticProps } from '../types.js';
	import { SelectContentState } from '../select.svelte.js';
	import PopperLayer from '../../../../internal/popper-layer/popper-layer.svelte';
	import { createId } from '../../../../internal/create-id.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
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
		isStatic: true,
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
	forceMount
	present={contentState.root.present}>
	{#snippet popper({ props })}
		{@const finalProps = mergeProps(props, { style: contentState.props.style }, { style }, { style: contentState.contentStyle })}
		{#if child}
			{@render child({ props: finalProps, ...contentState.snippetProps })}
		{:else}
			<div {...finalProps}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PopperLayer>
