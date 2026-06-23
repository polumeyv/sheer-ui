<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import type { TooltipContentStaticProps } from '../types.js';
	import { TooltipContentState } from '../tooltip.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import PopperLayer from '$lib/components/utilities/popper-layer/popper-layer.svelte';
	import { getFloatingContentCSSVars } from '$lib/internal/floating-svelte/floating-utils.svelte.js';
	import FloatingLayerArrow from '$lib/components/utilities/floating-layer/components/floating-layer-arrow.svelte';
	import { cn } from '$lib/utils.js';

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		arrowClasses,
		onInteractOutside = () => {},
		onEscapeKeydown = () => {},
		forceMount = false,
		style,
		...restProps
	}: TooltipContentStaticProps & {
		arrowClasses?: string;
	} = $props();

	const contentState = TooltipContentState.create({
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
				'data-slot': 'tooltip-content',
				class:
					'bg-foreground text-background transition-[opacity,scale,translate] starting:opacity-0 starting:scale-95 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data-[side=bottom]:starting:-translate-y-2 data-[side=top]:starting:translate-y-2 data-[side=left]:starting:translate-x-2 data-[side=right]:starting:-translate-x-2 z-50 w-fit origin-(--bits-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
			},
			restProps,
			contentState.props,
		),
	);
</script>

{#snippet inner()}
	{@render children?.()}
	<FloatingLayerArrow>
		{#snippet child({ props })}
			<div
				class={cn(
					'bg-foreground z-50 size-2.5 rotate-45 rounded-xs',
					'data-[side=top]:translate-x-1/2 data-[side=top]:translate-y-[calc(-50%+2px)]',
					'data-[side=bottom]:-translate-x-1/2 data-[side=bottom]:-translate-y-[calc(-50%+1px)]',
					'data-[side=right]:translate-x-[calc(50%+2px)] data-[side=right]:translate-y-1/2',
					'data-[side=left]:-translate-y-[calc(50%-3px)]',
					arrowClasses,
				)}
				{...props}>
			</div>
		{/snippet}
	</FloatingLayerArrow>
{/snippet}

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
				{@render inner()}
			</div>
		{/if}
	{/snippet}
</PopperLayer>
