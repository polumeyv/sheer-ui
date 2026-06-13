<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { ScrollAreaRootProps } from "$lib/components/scroll-area/primitive/index.js";
	import { ScrollAreaRootState } from "$lib/components/scroll-area/primitive/scroll-area.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		type = "hover",
		dir = "ltr",
		scrollHideDelay = 600,
		children,
		child,
		...restProps
	}: ScrollAreaRootProps = $props();

	const rootState = ScrollAreaRootState.create({
		type: { get current() { return type; } },
		dir: { get current() { return dir; } },
		scrollHideDelay: { get current() { return scrollHideDelay; } },
		id: { get current() { return id; } },
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
