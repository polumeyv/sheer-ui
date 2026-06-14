<script lang="ts">
	import { mergeProps } from '$lib/vendor';
	import { AccordionContentState } from '$lib/components/accordion/primitive/accordion.svelte';
	import type { AccordionContentProps } from '$lib/components/accordion/primitive/index';
	import { createId } from '$lib/vendor/create-id';

	const uid = $props.id();

	let {
		child,
		ref = $bindable(null),
		id = createId(uid),
		forceMount = false,
		children,
		hiddenUntilFound = false,
		...restProps
	}: AccordionContentProps = $props();

	const contentState = AccordionContentState.create({
		forceMount: {
			get current() {
				return forceMount;
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
		hiddenUntilFound: {
			get current() {
				return hiddenUntilFound;
			},
		},
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

{#if child}
	{@render child({
		props: mergedProps,
		...contentState.snippetProps,
	})}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
