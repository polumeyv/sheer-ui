<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { NavigationMenuTriggerProps } from "$lib/components/navigation-menu/primitive/index.js";
	import { NavigationMenuTriggerState } from "$lib/components/navigation-menu/primitive/navigation-menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import VisuallyHidden from "$lib/components/_shared/utilities/visually-hidden/visually-hidden.svelte";
	import Mounted from "$lib/components/_shared/utilities/mounted.svelte";

	const uid = $props.id();

	let {
		id = createId(uid),
		disabled = false,
		children,
		child,
		ref = $bindable(null),
		tabindex = 0,
		...restProps
	}: NavigationMenuTriggerProps = $props();

	const triggerState = NavigationMenuTriggerState.create({
		id: { get current() { return id; } },
		disabled: { get current() { return disabled ?? false; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props, { tabindex }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}

{#if triggerState.open}
	<VisuallyHidden {...triggerState.focusProxyProps} />
	<Mounted bind:mounted={triggerState.focusProxyMounted} />
	{#if triggerState.context.viewportRef.current}
		<span aria-owns={triggerState.itemContext.contentId ?? undefined}></span>
	{/if}
{/if}
