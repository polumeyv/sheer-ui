<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { ComboboxTriggerProps } from "$lib/components/combobox/index";
	import { useId } from "$lib/vendor/use-id";
	import { SelectComboTriggerState } from "$lib/components/combobox/primitive/select.svelte";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		children,
		type = "button",
		...restProps
	}: ComboboxTriggerProps = $props();

	const triggerState = SelectComboTriggerState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props, { type }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
