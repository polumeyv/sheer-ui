<script lang="ts">
	import { mergeProps } from "$lib/internal/merge-props.js";
	import { AccordionContentState } from "$lib/components/accordion/primitive/accordion.svelte.js";
	import type { AccordionContentProps } from "$lib/components/accordion/primitive/index.js";
	import { createId } from "$lib/internal/create-id.js";

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
