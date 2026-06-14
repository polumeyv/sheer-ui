<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { AlertDialogCancelProps } from "$lib/components/alert-dialog/primitive/index";
	import { AlertDialogCancelState } from "$lib/components/dialog/primitive/dialog.svelte";
	import { createId } from "$lib/vendor/create-id";

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
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		disabled: { get current() { return Boolean(disabled); } },
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
