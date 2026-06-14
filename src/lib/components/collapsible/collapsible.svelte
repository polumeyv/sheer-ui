<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { CollapsibleRootProps } from '$lib/components/primitive/collapsible/index';
	import { CollapsibleRootState } from '$lib/components/primitive/collapsible/collapsible.svelte';
	import { createId } from '$lib/vendor/create-id';

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		open = $bindable(false),
		disabled = false,
		onOpenChange = () => {},
		onOpenChangeComplete = () => {},
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

	const mergedProps = $derived(mergeProps({ 'data-slot': 'collapsible' }, restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
