<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { LinkPreviewTriggerProps } from '$lib/components/link-preview/types.js';
	import { LinkPreviewTriggerState } from '$lib/components/link-preview/link-preview.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { FloatingLayer } from '$lib/components/_shared/utilities/floating-layer/index.js';

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		child,
		children,
		...restProps
	}: LinkPreviewTriggerProps = $props();

	const triggerState = LinkPreviewTriggerState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(
		mergeProps({ 'data-slot': 'hover-card-trigger' }, restProps, triggerState.props),
	);
</script>

<FloatingLayer.Anchor {id} ref={triggerState.opts.ref}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<a {...mergedProps}>
			{@render children?.()}
		</a>
	{/if}
</FloatingLayer.Anchor>
