<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/index.js";
	import type { CheckboxGroupLabelProps } from "$lib/components/checkbox/primitive/index.js";
	import { CheckboxGroupLabelState } from "$lib/components/checkbox/primitive/checkbox.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		child,
		children,
		...restProps
	}: CheckboxGroupLabelProps = $props();

	const labelState = CheckboxGroupLabelState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
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
