<script lang="ts">
	import { mergeProps } from '$lib/vendor/index.js';
	import type { LinkPreviewTriggerProps } from '$lib/components/link-preview/index.js';
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
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
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
