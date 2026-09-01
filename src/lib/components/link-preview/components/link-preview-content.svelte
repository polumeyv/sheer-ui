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
		// (sideOffset, alignOffset, avoidCollisions, collisionPadding, arrowPadding, dir, customAnchor,
		//  forceMount).
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

	const lifecycleProps = useNativePopoverLifecycle(contentState);

	const mounted = mountedAttachment<HTMLElement>((m) => (contentState.root.contentMounted = m));

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'hover-card-content',
				class:
					'bg-popover text-popover-foreground z-50 w-64 rounded-md border p-4 shadow-md outline-none transition-[opacity,scale,translate,display,overlay] transition-discrete opacity-0 scale-95 data-[state=closed]:pointer-events-none data-[state=open]:opacity-100 data-[state=open]:scale-100 starting:data-[state=open]:opacity-0 starting:data-[state=open]:scale-95',
			},
			restProps,
			contentState.props,
			{ style },
			mounted,
			lifecycleProps,
		),
	);
</script>

{#if child}
	{@render child({ props: mergedProps, ...contentState.snippetProps })}
{:else}
	<div {...mergedProps} bind:this={ref} data-side={side} data-align={align}>
		{@render children?.()}
	</div>
{/if}
