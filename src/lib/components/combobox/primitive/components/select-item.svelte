<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import { SelectItemState } from "$lib/components/combobox/primitive/select.svelte";
	import type { SelectItemProps } from "$lib/components/combobox/primitive/index";
	import { createId } from "$lib/vendor/create-id";
	import Mounted from "$lib/components/_shared/utilities/mounted.svelte";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		value,
		label = value,
		disabled = false,
		children,
		child,
		onHighlight = (() => {}),
		onUnhighlight = (() => {}),
		...restProps
	}: SelectItemProps = $props();

	const itemState = SelectItemState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		value: { get current() { return value; } },
		disabled: { get current() { return disabled; } },
		label: { get current() { return label; } },
		onHighlight: { get current() { return onHighlight; } },
		onUnhighlight: { get current() { return onUnhighlight; } },
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...itemState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(itemState.snippetProps)}
	</div>
{/if}

<Mounted bind:mounted={itemState.mounted} />
