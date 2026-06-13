<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { SelectGroupHeadingProps } from "$lib/components/select/primitive/index.js";
	import { SelectGroupHeadingState } from "$lib/components/select/primitive/select.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();
	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		children,
		...restProps
	}: SelectGroupHeadingProps = $props();

	const groupHeadingState = SelectGroupHeadingState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, groupHeadingState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
