<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { CheckboxGroupLabelProps } from "$lib/components/checkbox/primitive/index";
	import { CheckboxGroupLabelState } from "$lib/components/checkbox/primitive/checkbox.svelte";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		child,
		children,
		...restProps
	}: CheckboxGroupLabelProps = $props();

	const labelState = CheckboxGroupLabelState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, labelState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>
		{@render children?.()}
	</span>
{/if}
