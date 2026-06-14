<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import { TimeFieldLabelState } from "$lib/components/primitive/time-field/time-field.svelte";
	import type { TimeFieldLabelProps } from "$lib/components/primitive/time-field/index";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		...restProps
	}: TimeFieldLabelProps = $props();

	const labelState = TimeFieldLabelState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, labelState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
