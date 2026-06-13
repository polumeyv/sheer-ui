<script lang="ts">
	import { mergeProps } from '$lib/vendor/index.js';
	import type { AlertDialogCancelProps } from '$lib/components/alert-dialog/primitive/index.js';
	import { AlertDialogCancelState } from '$lib/components/dialog/primitive/dialog.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { buttonVariants } from '../button';
	import { cn } from '../../vendor/utils';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		disabled = false,
		class: className,
		...restProps
	}: AlertDialogCancelProps = $props();

	const cancelState = AlertDialogCancelState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		disabled: { get current() { return Boolean(disabled); } },
	});

	const mergedProps = $derived(
		mergeProps(
			{ 'data-slot': 'alert-dialog-cancel', class: cn(buttonVariants({ variant: 'outline' }), className) },
			restProps,
			cancelState.props
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
