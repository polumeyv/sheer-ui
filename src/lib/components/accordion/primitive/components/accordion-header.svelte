<script lang="ts">
	import { mergeProps } from "$lib/internal/merge-props.js";
	import type { AccordionHeaderProps } from "$lib/components/accordion/primitive/index.js";
	import { AccordionHeaderState } from "$lib/components/accordion/primitive/accordion.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		level = 2,
		children,
		child,
		ref = $bindable(null),
		...restProps
	}: AccordionHeaderProps = $props();

	const headerState = AccordionHeaderState.create({
		id: {
			get current() {
				return id;
			},
		},
		level: {
			get current() {
				return level;
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

	const mergedProps = $derived(mergeProps(restProps, headerState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
