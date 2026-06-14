<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import { CollapsibleContentState } from '$lib/components/primitive/collapsible/collapsible.svelte';
	import type { CollapsibleContentProps } from '$lib/components/primitive/collapsible/index';
	import { createId } from '$lib/vendor/create-id';

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

	const mergedProps = $derived(mergeProps({ 'data-slot': 'collapsible-content' }, restProps, contentState.props));
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
