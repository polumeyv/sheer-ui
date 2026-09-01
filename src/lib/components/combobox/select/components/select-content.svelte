<script lang="ts">
	import { join } from 'overrule';
	import type { ClassValue } from 'svelte/elements';
	import { boxWith } from '../../../../internal/tools/index.js';
	import { mergeProps } from '../../../../internal/merge-props.js';

	import type { SelectContentProps } from '../types.js';
	import { SelectContentState } from '../select.svelte.js';

	import PopperLayer from '../../../../internal/popper-layer/popper-layer.svelte';

	import SelectScrollUpButton from './select-scroll-up-button.svelte';
	import SelectScrollDownButton from './select-scroll-down-button.svelte';

	import { createId } from '../../../../internal/create-id.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),

		class: className,
		side = 'bottom',
		sideOffset = 4,
		preventScroll = true,

		onInteractOutside = () => {},
		onEscapeKeydown = () => {},

		children,
		child,
		style,
		...restProps
	}: SelectContentProps & {
		class?: ClassValue;
		sideOffset?: number;
	} = $props();

	const contentState = SelectContentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		onInteractOutside: boxWith(() => onInteractOutside),
		onEscapeKeydown: boxWith(() => onEscapeKeydown),
	});
	const contentClass = $derived(
		join(
			'relative isolate z-50 min-w-36 overflow-x-hidden overflow-y-auto rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 popup-surface',
			className,
		),
	);

	const mergedProps = $derived(
		mergeProps(
			restProps,
			{
				sideOffset,
				'data-slot': 'select-content',
				class: contentClass,
			},
			contentState.props,
		),
	);
</script>

<PopperLayer
	{...mergedProps}
	{...contentState.popperProps}
	ref={contentState.opts.ref}
	{side}
	open={contentState.root.opts.open.current}
	{id}
	{preventScroll}
	present={contentState.root.present}>
	{#snippet popper({ props, wrapperProps })}
		{@const finalProps = mergeProps(props, { style: contentState.props.style }, { style }, { style: contentState.contentStyle })}

		{#if child}
			{@render child({ props: finalProps, wrapperProps, ...contentState.snippetProps })}
		{:else}
			<div {...wrapperProps}>
				<div {...finalProps}>
					<SelectScrollUpButton />

					<div class="h-(--bits-select-anchor-height) w-full min-w-(--bits-select-anchor-width) scroll-my-1">
						{@render children?.()}
					</div>

					<SelectScrollDownButton />
				</div>
			</div>
		{/if}
	{/snippet}
</PopperLayer>
