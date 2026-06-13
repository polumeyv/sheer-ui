<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { MenuSeparatorProps } from "$lib/components/_shared/menu/index.js";
	import { MenuSeparatorState } from "$lib/components/_shared/menu/menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

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
