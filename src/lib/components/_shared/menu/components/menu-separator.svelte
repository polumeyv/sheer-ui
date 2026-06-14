<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { MenuSeparatorProps } from "$lib/components/_shared/menu/index";
	import { MenuSeparatorState } from "$lib/components/_shared/menu/group.svelte";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		child,
		children,
		...restProps
	}: MenuSeparatorProps = $props();

	const separatorState = MenuSeparatorState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, separatorState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
