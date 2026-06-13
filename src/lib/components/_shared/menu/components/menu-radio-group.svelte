<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { MenuRadioGroupProps } from "$lib/components/_shared/menu/index.js";
	import { MenuRadioGroupState } from "$lib/components/_shared/menu/menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		children,
		child,
		ref = $bindable(null),
		value = $bindable(""),
		onValueChange = (() => {}),
		...restProps
	}: MenuRadioGroupProps = $props();

	const radioGroupState = MenuRadioGroupState.create({
		value: { get current() { return value; }, set current(v) { value = v; onValueChange(v); } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		id: { get current() { return id; } },
	});

	const mergedProps = $derived(mergeProps(restProps, radioGroupState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
