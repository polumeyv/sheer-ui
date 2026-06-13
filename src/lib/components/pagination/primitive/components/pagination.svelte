<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/index.js";
	import type { PaginationRootProps } from "$lib/components/pagination/primitive/index.js";
	import { PaginationRootState } from "$lib/components/pagination/primitive/pagination.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		count,
		perPage = 1,
		page = $bindable(1),
		ref = $bindable(null),
		siblingCount = 1,
		onPageChange = (() => {}),
		loop = false,
		orientation = "horizontal",
		child,
		children,
		...restProps
	}: PaginationRootProps = $props();

	const rootState = PaginationRootState.create({
		id: boxWith(() => id),
		count: boxWith(() => count),
		perPage: boxWith(() => perPage),
		page: boxWith(
			() => page,
			(v) => {
				page = v;
				onPageChange?.(v);
			}
		),
		loop: boxWith(() => loop),
		siblingCount: boxWith(() => siblingCount),
		orientation: boxWith(() => orientation),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...rootState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(rootState.snippetProps)}
	</div>
{/if}
