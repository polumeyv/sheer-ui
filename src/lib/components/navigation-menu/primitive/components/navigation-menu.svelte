<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { NavigationMenuRootProps } from "$lib/components/navigation-menu/primitive/index";
	import { NavigationMenuRootState } from "$lib/components/navigation-menu/primitive/navigation-menu.svelte";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		child,
		children,
		id = createId(uid),
		ref = $bindable(null),
		value = $bindable(""),
		onValueChange = (() => {}),
		delayDuration = 200,
		skipDelayDuration = 300,
		dir = "ltr",
		orientation = "horizontal",
		...restProps
	}: NavigationMenuRootProps = $props();

	const rootState = NavigationMenuRootState.create({
		id: { get current() { return id; } },
		value: { get current() { return value; }, set current(v) { value = v; onValueChange(v); } },
		delayDuration: { get current() { return delayDuration; } },
		skipDelayDuration: { get current() { return skipDelayDuration; } },
		dir: { get current() { return dir; } },
		orientation: { get current() { return orientation; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps({ "aria-label": "main" }, restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<nav {...mergedProps}>
		{@render children?.()}
	</nav>
{/if}
