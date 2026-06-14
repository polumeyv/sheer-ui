<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { SelectScrollDownButtonProps } from "$lib/components/primitive/combobox/index";
	import { SelectScrollDownButtonState } from "$lib/components/primitive/combobox/select.svelte";
	import { createId } from "$lib/vendor/create-id";
	import { Mounted } from "$lib/components/_shared/utilities/index";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		delay = () => 50,
		child,
		children,
		...restProps
	}: SelectScrollDownButtonProps = $props();

	const scrollButtonState = SelectScrollDownButtonState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		delay: { get current() { return delay; } },
	});

	const mergedProps = $derived(mergeProps(restProps, scrollButtonState.props));
</script>

{#if scrollButtonState.canScrollDown}
	<Mounted bind:mounted={scrollButtonState.scrollButtonState.mounted} />
	{#if child}
		{@render child({ props: restProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
{/if}
