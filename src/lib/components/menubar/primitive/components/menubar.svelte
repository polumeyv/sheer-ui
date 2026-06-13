<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { MenubarRootProps } from "$lib/components/menubar/primitive/index.js";
	import { MenubarRootState } from "$lib/components/menubar/primitive/menubar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		children,
		child,
		ref = $bindable(null),
		value = $bindable(""),
		dir = "ltr",
		loop = true,
		onValueChange = (() => {}),
		...restProps
	}: MenubarRootProps = $props();

	const rootState = MenubarRootState.create({
		id: { get current() { return id; } },
		value: { get current() { return value; }, set current(v) { value = v; onValueChange?.(v); } },
		dir: { get current() { return dir; } },
		loop: { get current() { return loop; } },
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
