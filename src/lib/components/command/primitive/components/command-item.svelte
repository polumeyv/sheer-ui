<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { CommandItemProps } from "$lib/components/command/primitive/index";
	import { CommandItemState } from "$lib/components/command/primitive/command.svelte";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		value = "",
		disabled = false,
		children,
		child,
		onSelect = (() => {}),
		forceMount = false,
		keywords = [],
		...restProps
	}: CommandItemProps = $props();

	const itemState = CommandItemState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		value: { get current() { return value; } },
		disabled: { get current() { return disabled; } },
		onSelect: { get current() { return onSelect; } },
		forceMount: { get current() { return forceMount; } },
		keywords: { get current() { return keywords; } },
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props));
</script>

{#key itemState.root.key}
	<div style="display: contents;" data-item-wrapper data-value={itemState.trueValue}>
		{#if itemState.shouldRender}
			{#if child}
				{@render child({ props: mergedProps })}
			{:else}
				<div {...mergedProps}>
					{@render children?.()}
				</div>
			{/if}
		{/if}
	</div>
{/key}
