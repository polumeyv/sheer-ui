<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { MenuRadioGroupProps } from "$lib/components/_shared/menu/index";
	import { MenuRadioGroupState } from "$lib/components/_shared/menu/radio.svelte";
	import { createId } from "$lib/vendor/create-id";

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
