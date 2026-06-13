<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { SelectContentProps } from '$lib/components/select/primitive/index.js';
	import { SelectContentState } from '$lib/components/select/primitive/select.svelte.js';
	import PopperLayer from '$lib/components/_shared/utilities/popper-layer/popper-layer.svelte';
	import { createId } from '$lib/internal/create-id.js';
	import { getFloatingContentCSSVars } from '$lib/internal/floating-svelte/floating-utils.svelte.js';
	import PopperLayerForceMount from '$lib/components/_shared/utilities/popper-layer/popper-layer-force-mount.svelte';
	import SelectViewport from '$lib/components/select/primitive/components/select-viewport.svelte';
	import SelectPortal from './select-portal.svelte';
	import SelectScrollUpButton from './select-scroll-up-button.svelte';
	import SelectScrollDownButton from './select-scroll-down-button.svelte';
	import { cn, type WithoutChild, type WithoutChildrenOrChild } from '../../vendor/utils';
	import type { ComponentProps } from 'svelte';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		forceMount = false,
		side = 'bottom',
		sideOffset = 4,
		onInteractOutside = (() => {}),
		onEscapeKeydown = (() => {}),
		children,
		preventScroll = true,
		portalProps,
		class: className,
		style,
		...restProps
	}: WithoutChild<SelectContentProps> & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof SelectPortal>>;
	} = $props();

	const contentState = SelectContentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		onInteractOutside: boxWith(() => onInteractOutside),
		onEscapeKeydown: boxWith(() => onEscapeKeydown),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'select-content',
				class: cn(
					'bg-popover text-popover-foreground transition-[opacity,scale,translate] starting:opacity-0 starting:scale-95 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data-[side=bottom]:starting:-translate-y-1 data-[side=top]:starting:translate-y-1 data-[side=left]:starting:translate-x-1 data-[side=right]:starting:-translate-x-1 relative z-50 max-h-(--bits-select-content-available-height) min-w-[8rem] origin-(--bits-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
					className,
				),
			},
			restProps,
			contentState.props
		)
	);
</script>

<SelectPortal {...portalProps}>
	{#if forceMount}
		<PopperLayerForceMount
			{...mergedProps}
			{...contentState.popperProps}
			ref={contentState.opts.ref}
			{side}
			{sideOffset}
			enabled={contentState.root.opts.open.current}
			{id}
			{preventScroll}
			forceMount={true}
			shouldRender={contentState.shouldRender}
		>
			{#snippet popper({ props, wrapperProps })}
				{@const finalProps = mergeProps(props, { style: getFloatingContentCSSVars('select') }, { style })}
				<div {...wrapperProps}>
					<div {...finalProps}>
						<SelectScrollUpButton />
						<SelectViewport class={cn('h-(--bits-select-anchor-height) w-full min-w-(--bits-select-anchor-width) scroll-my-1 p-1')}>
							{@render children?.()}
						</SelectViewport>
						<SelectScrollDownButton />
					</div>
				</div>
			{/snippet}
		</PopperLayerForceMount>
	{:else if !forceMount}
		<PopperLayer
			{...mergedProps}
			{...contentState.popperProps}
			ref={contentState.opts.ref}
			{side}
			{sideOffset}
			open={contentState.root.opts.open.current}
			{id}
			{preventScroll}
			forceMount={false}
			shouldRender={contentState.shouldRender}
		>
			{#snippet popper({ props, wrapperProps })}
				{@const finalProps = mergeProps(props, { style: getFloatingContentCSSVars('select') }, { style })}
				<div {...wrapperProps}>
					<div {...finalProps}>
						<SelectScrollUpButton />
						<SelectViewport class={cn('h-(--bits-select-anchor-height) w-full min-w-(--bits-select-anchor-width) scroll-my-1 p-1')}>
							{@render children?.()}
						</SelectViewport>
						<SelectScrollDownButton />
					</div>
				</div>
			{/snippet}
		</PopperLayer>
	{/if}
</SelectPortal>
