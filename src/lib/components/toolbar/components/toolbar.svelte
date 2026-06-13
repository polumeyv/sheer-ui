<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/toolbelt/index.js";
	import type { ToolbarRootProps } from "$lib/components/toolbar/types.js";
	import { ToolbarRootState } from "$lib/components/toolbar/toolbar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		orientation = "horizontal",
		loop = true,
		child,
		children,
		...restProps
	}: ToolbarRootProps = $props();

	const rootState = ToolbarRootState.create({
		id: boxWith(() => id),
		orientation: boxWith(() => orientation),
		loop: boxWith(() => loop),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
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
