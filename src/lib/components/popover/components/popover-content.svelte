<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { PopoverContentProps } from '../types.js';
	import { PopoverContentState } from '../popover.svelte.js';
	import { createId } from '../../../internal/create-id.js';
	import { useNativePopoverLifecycle } from '../../../internal/native-popover.svelte.js';

	const uid = $props.id();

	let {
		child,
		children,
		ref = $bindable(null),
		id = createId(uid),
		side = 'bottom',
		align = 'center',
		customAnchor = null,
		style,
		// No native equivalent — accepted for API compatibility but intentionally ignored.
		// Native popovers don't trap focus or lock scroll (ARIA-correct for a non-modal
		// popover), and the content is always mounted (the popover toggles `display` itself),
		// so trapFocus / preventScroll / forceMount / the FU auto-focus hooks are no-ops.
		// Dismissal is the UA's (`popover="auto"` light dismiss + top-layer Escape), so the
		// onInteractOutside / onEscapeKeydown interception hooks are no-ops too.
		// The remaining FU-only positioning props (sideOffset, avoidCollisions, …) ride in
		// restProps; native CSS `anchor()` positioning ignores them.
		trapFocus = true,
		preventScroll = false,
		forceMount = false,
		onOpenAutoFocus = () => {},
		onCloseAutoFocus = () => {},
		onInteractOutside = () => {},
		onEscapeKeydown = () => {},
		...restProps
	}: PopoverContentProps = $props();

	const contentState = PopoverContentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		customAnchor: boxWith(() => customAnchor),
	});

	const lifecycleProps = useNativePopoverLifecycle(contentState, { anchor: () => customAnchor, mode: 'auto' });

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'popover-content',
				class:
					'bg-popover text-popover-foreground z-50 w-72 rounded-md border p-4 shadow-md outline-hidden transition-[opacity,scale,translate,display,overlay] transition-discrete opacity-0 scale-95 open:opacity-100 open:scale-100 starting:open:opacity-0 starting:open:scale-95',
			},
			restProps,
			contentState.props,
			{ style },
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
