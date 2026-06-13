<script lang="ts">
	import { mergeProps } from "$lib/internal/merge-props.js";
	import type { AccordionItemProps } from "$lib/components/accordion/primitive/index.js";
	import { AccordionItemState } from "$lib/components/accordion/primitive/accordion.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();
	const defaultId = createId(uid);

	let {
		id = defaultId,
		disabled = false,
		value = defaultId,
		children,
		child,
		ref = $bindable(null),
		...restProps
	}: AccordionItemProps = $props();

	const itemState = AccordionItemState.create({
		value: {
			get current() {
				return value;
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
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
