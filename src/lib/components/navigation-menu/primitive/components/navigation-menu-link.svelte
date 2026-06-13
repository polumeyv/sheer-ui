<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/toolbelt/index.js";
	import type { NavigationMenuLinkProps } from "$lib/components/navigation-menu/primitive/index.js";
	import { NavigationMenuLinkState } from "$lib/components/navigation-menu/primitive/navigation-menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		children,
		active = false,
		onSelect = (() => {}),
		tabindex = 0,
		...restProps
	}: NavigationMenuLinkProps = $props();

	const linkState = NavigationMenuLinkState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		active: boxWith(() => active),
		onSelect: boxWith(() => onSelect),
	});

	const mergedProps = $derived(mergeProps(restProps, linkState.props, { tabindex }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<a {...mergedProps}>
		{@render children?.()}
	</a>
{/if}
