<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { MenuGroupProps } from "$lib/components/_shared/menu/index";
	import { MenuGroupState } from "$lib/components/_shared/menu/group.svelte";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: MenuGroupProps = $props();

	const groupState = MenuGroupState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});
	const mergedProps = $derived(mergeProps(restProps, groupState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
