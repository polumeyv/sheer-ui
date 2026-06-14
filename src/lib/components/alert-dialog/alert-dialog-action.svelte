<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { AlertDialogActionProps } from '$lib/components/primitive/dialog/index';
	import { DialogActionState } from '$lib/components/primitive/dialog/dialog.svelte';
	import { createId } from '$lib/vendor/create-id';
	import { buttonVariants } from '../button';
	import { cn } from '../../vendor/utils';

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		class: className,
		...restProps
	}: AlertDialogActionProps = $props();

	const actionState = DialogActionState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(
		mergeProps(
			{ 'data-slot': 'alert-dialog-action', class: cn(buttonVariants(), className) },
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
