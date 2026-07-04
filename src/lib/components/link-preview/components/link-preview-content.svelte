<script lang="ts">
	import { boxWith, mountedAttachment } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { LinkPreviewContentProps } from '../types.js';
	import { LinkPreviewContentState } from '../link-preview.svelte.js';
	import { createId } from '../../../internal/create-id.js';
	import { useNativePopoverLifecycle } from '../../../internal/native-popover.svelte.js';

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		side = 'top',
		align = 'center',
		onInteractOutside = () => {},
		onEscapeKeydown = () => {},
		style,
		// Floating-UI-only props kept for API compatibility; native positioning ignores them
		// (sideOffset, alignOffset, avoidCollisions, collisionBoundary, collisionPadding, arrowPadding,
		//  sticky, hideWhenDetached, dir, customAnchor, forceMount).
		...restProps
	}: LinkPreviewContentProps = $props();

	const contentState = LinkPreviewContentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		onInteractOutside: boxWith(() => onInteractOutside),
		onEscapeKeydown: boxWith(() => onEscapeKeydown),
	});

	useNativePopoverLifecycle({
		anchor: () => contentState.root.triggerNode,
		open: () => contentState.root.opts.open.current,
		ref: () => ref,
		triggerNode: () => contentState.root.triggerNode,
		onEscapeKeydown: () => contentState.onEscapeKeydown,
		onInteractOutside: () => contentState.onInteractOutside,
		onOpenChangeComplete: () => contentState.root.opts.onOpenChangeComplete.current,
	});

	const mounted = mountedAttachment<HTMLElement>((m) => (contentState.root.contentMounted = m));

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'hover-card-content',
				'data-anchored': '',
				class:
					'bg-popover text-popover-foreground z-50 w-64 rounded-md border p-4 shadow-md outline-none transition-[opacity,scale,translate,display,overlay] transition-discrete opacity-0 scale-95 open:opacity-100 open:scale-100 starting:open:opacity-0 starting:open:scale-95',
			},
			restProps,
			contentState.props,
			{ style },
			mounted,
		),
	);
</script>

{#if child}
	{@render child({ props: mergeProps(mergedProps, { popover: 'manual' }), wrapperProps: {}, ...contentState.snippetProps })}
{:else}
	<div {...mergedProps} bind:this={ref} popover="manual" data-side={side} data-align={align}>
		{@render children?.()}
	</div>
{/if}
