<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { AlertDialogActionProps } from '$lib/components/alert-dialog/primitive/index.js';
	import { DialogActionState } from '$lib/components/dialog/primitive/dialog.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
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
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
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
