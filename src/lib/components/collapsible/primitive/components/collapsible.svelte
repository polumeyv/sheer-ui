<script lang="ts">
	import { mergeProps } from "$lib/internal/merge-props.js";
	import type { CollapsibleRootProps } from "$lib/components/collapsible/primitive/index.js";
	import { CollapsibleRootState } from "$lib/components/collapsible/primitive/collapsible.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		open = $bindable(false),
		disabled = false,
		onOpenChange = (() => {}),
		onOpenChangeComplete = (() => {}),
		...restProps
	}: CollapsibleRootProps = $props();

	const rootState = CollapsibleRootState.create({
		open: {
			get current() {
				return open;
			},
			set current(v) {
				open = v;
				onOpenChange(v);
			},
		},
		disabled: {
			get current() {
				return disabled;
			},
		},
		id: {
			get current() {
				return id;
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
		onOpenChangeComplete: {
			get current() {
				return onOpenChangeComplete;
			},
		},
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
