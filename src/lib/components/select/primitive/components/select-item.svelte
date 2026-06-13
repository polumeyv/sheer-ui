<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/toolbelt/index.js";
	import { SelectItemState } from "$lib/components/select/primitive/select.svelte.js";
	import type { SelectItemProps } from "$lib/components/select/primitive/index.js";
	import { createId } from "$lib/internal/create-id.js";
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
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		value: boxWith(() => value),
		disabled: boxWith(() => disabled),
		label: boxWith(() => label),
		onHighlight: boxWith(() => onHighlight),
		onUnhighlight: boxWith(() => onUnhighlight),
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
