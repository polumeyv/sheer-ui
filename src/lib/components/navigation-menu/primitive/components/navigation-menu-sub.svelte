<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { NavigationMenuSubProps } from "$lib/components/navigation-menu/primitive/index";
	import { NavigationMenuSubState } from "$lib/components/navigation-menu/primitive/navigation-menu.svelte";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		child,
		children,
		id = createId(uid),
		ref = $bindable(null),
		value = $bindable(""),
		onValueChange = (() => {}),
		orientation = "horizontal",
		...restProps
	}: NavigationMenuSubProps = $props();

	const rootState = NavigationMenuSubState.create({
		id: { get current() { return id; } },
		value: { get current() { return value; }, set current(v) { value = v; onValueChange(v); } },
		orientation: { get current() { return orientation; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
