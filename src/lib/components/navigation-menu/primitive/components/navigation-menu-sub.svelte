<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { NavigationMenuSubProps } from "$lib/components/navigation-menu/primitive/index.js";
	import { NavigationMenuSubState } from "$lib/components/navigation-menu/primitive/navigation-menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

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
