<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { MenuGroupHeadingProps } from "$lib/components/_shared/menu/index.js";
	import { MenuGroupHeadingState } from "$lib/components/_shared/menu/menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: MenuGroupHeadingProps = $props();

	const groupHeadingState = MenuGroupHeadingState.create({
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
