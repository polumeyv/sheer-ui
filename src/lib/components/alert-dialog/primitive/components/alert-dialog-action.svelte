<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { AlertDialogActionProps } from "$lib/components/alert-dialog/primitive/index.js";
	import { DialogActionState } from "$lib/components/dialog/primitive/dialog.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		...restProps
	}: AlertDialogActionProps = $props();

	const actionState = DialogActionState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, actionState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
