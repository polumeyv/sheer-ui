<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { SelectGroupHeadingProps } from "$lib/components/combobox/primitive/index";
	import { SelectGroupHeadingState } from "$lib/components/combobox/primitive/select.svelte";
	import { createId } from "$lib/vendor/create-id";

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
