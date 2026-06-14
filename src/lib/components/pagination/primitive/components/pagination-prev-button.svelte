<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { PaginationPrevButtonProps } from "$lib/components/pagination/primitive/index";
	import { PaginationButtonState } from "$lib/components/pagination/primitive/pagination.svelte";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		id = createId(uid),
		child,
		children,
		ref = $bindable(null),
		type = "button",
		disabled = false,
		...restProps
	}: PaginationPrevButtonProps = $props();

	const prevButtonState = PaginationButtonState.create({
		type: "prev",
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		disabled: { get current() { return Boolean(disabled); } },
	});

	const mergedProps = $derived(mergeProps(restProps, prevButtonState.props, { type }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
