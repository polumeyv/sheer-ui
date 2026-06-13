<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/toolbelt/index.js";
	import type { AlertDialogCancelProps } from "$lib/components/alert-dialog/primitive/types.js";
	import { AlertDialogCancelState } from "$lib/components/dialog/primitive/dialog.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		disabled = false,
		...restProps
	}: AlertDialogCancelProps = $props();

	const cancelState = AlertDialogCancelState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		disabled: boxWith(() => Boolean(disabled)),
	});

	const mergedProps = $derived(mergeProps(restProps, cancelState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
