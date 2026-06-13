<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/toolbelt/index.js";
	import type { PaginationNextButtonProps } from "$lib/components/pagination/primitive/index.js";
	import { PaginationButtonState } from "$lib/components/pagination/primitive/pagination.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		child,
		children,
		ref = $bindable(null),
		type = "button",
		disabled = false,
		...restProps
	}: PaginationNextButtonProps = $props();

	const nextButtonState = PaginationButtonState.create({
		type: "next",
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		disabled: boxWith(() => Boolean(disabled)),
	});

	const mergedProps = $derived(mergeProps(restProps, nextButtonState.props, { type }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
