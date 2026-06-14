<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { RatingGroupItemProps } from "$lib/components/primitive/rating-group/index";
	import { RatingGroupItemState } from "$lib/components/primitive/rating-group/rating-group.svelte";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		disabled = false,
		index,
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: RatingGroupItemProps = $props();

	const itemState = RatingGroupItemState.create({
		disabled: { get current() { return Boolean(disabled); } },
		index: { get current() { return index; } },
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...itemState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(itemState.snippetProps)}
	</div>
{/if}
