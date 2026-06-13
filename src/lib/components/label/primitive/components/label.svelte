<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/index.js";
	import type { LabelRootProps } from "$lib/components/label/primitive/index.js";
	import { LabelRootState } from "$lib/components/label/primitive/label.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		for: forProp,
		...restProps
	}: LabelRootProps = $props();

	const rootState = LabelRootState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});
	const mergedProps = $derived(mergeProps(restProps, rootState.props, { for: forProp }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<label {...mergedProps} for={forProp}>
		{@render children?.()}
	</label>
{/if}
