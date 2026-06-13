<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import { DateFieldLabelState } from "$lib/components/date-field/date-field.svelte.js";
	import type { DateFieldLabelProps } from "$lib/components/date-field/index.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		...restProps
	}: DateFieldLabelProps = $props();

	const labelState = DateFieldLabelState.create({
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
