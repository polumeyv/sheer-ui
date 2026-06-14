<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { LinkPreviewTriggerProps } from "$lib/components/primitive/link-preview/index";
	import { LinkPreviewTriggerState } from "./link-preview.svelte.js";
	import { createId } from "$lib/vendor/create-id";
	import { FloatingLayer } from "$lib/components/_shared/utilities/floating-layer/index";

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

	const mergedProps = $derived(mergeProps(restProps, triggerState.props));
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
