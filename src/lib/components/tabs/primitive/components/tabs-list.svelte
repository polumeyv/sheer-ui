<script lang="ts">
	import { mergeProps } from "$lib/internal/merge-props.js";
	import type { TabsListProps } from "$lib/components/tabs/primitive/index.js";
	import { TabsListState } from "$lib/components/tabs/primitive/tabs.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		child,
		children,
		id = createId(uid),
		ref = $bindable(null),
		...restProps
	}: TabsListProps = $props();

	const listState = TabsListState.create({
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

	const mergedProps = $derived(mergeProps(restProps, listState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
