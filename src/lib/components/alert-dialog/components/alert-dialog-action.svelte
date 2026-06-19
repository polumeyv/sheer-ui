<script lang="ts">
	import { boxWith, mergeProps } from "$lib/internal/toolbelt.js";
	import type { AlertDialogActionProps } from "../types.js";
	import { DialogActionState } from "$lib/components/dialog/dialog.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import { buttonVariants } from "$lib/components/button/variants.js";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		...restProps
	}: AlertDialogActionProps = $props();

	const actionState = DialogActionState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{ "data-slot": "alert-dialog-action", class: buttonVariants() },
			restProps,
			actionState.props
		)
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
