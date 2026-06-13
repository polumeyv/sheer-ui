<script lang="ts">
	import { mergeProps } from "$lib/internal/merge-props.js";
	import { CollapsibleContentState } from "$lib/components/collapsible/primitive/collapsible.svelte.js";
	import type { CollapsibleContentProps } from "$lib/components/collapsible/primitive/index.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		child,
		ref = $bindable(null),
		forceMount = false,
		hiddenUntilFound = false,
		children,
		id = createId(uid),
		...restProps
	}: CollapsibleContentProps = $props();

	const contentState = CollapsibleContentState.create({
		id: {
			get current() {
				return id;
			},
		},
		forceMount: {
			get current() {
				return forceMount;
			},
		},
		hiddenUntilFound: {
			get current() {
				return hiddenUntilFound;
			},
		},
		ref: {
			get current() {
				return ref;
			},
			set current(v) {
				ref = v;
			},
		},
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

{#if child}
	{@render child({
		...contentState.snippetProps,
		props: mergedProps,
	})}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
