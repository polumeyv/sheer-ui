<script lang="ts">
import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
import AlertDialogPortal from './alert-dialog-portal.svelte';
import AlertDialogOverlay from './alert-dialog-overlay.svelte';
import { cn, type WithoutChild, type WithoutChildrenOrChild } from '../../utils';
import type { ComponentProps } from 'svelte';

let {
	ref = $bindable(null),
	class: className,
	portalProps,
	...restProps
}: WithoutChild<AlertDialogPrimitive.ContentProps> & {
	portalProps?: WithoutChildrenOrChild<ComponentProps<typeof AlertDialogPortal>>;
} = $props();
</script>

<AlertDialogPortal {...portalProps}>
	<AlertDialogOverlay />
	<AlertDialogPrimitive.Content
		bind:ref
		data-slot="alert-dialog-content"
		class={cn(
			"bg-background transition-[opacity,scale] starting:opacity-0 starting:scale-95 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 fixed inset-s-[50%] top-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
			className
		)}
		{...restProps}
	/>
</AlertDialogPortal>
