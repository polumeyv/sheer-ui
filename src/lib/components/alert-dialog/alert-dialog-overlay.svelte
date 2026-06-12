<script lang="ts">
import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
import { cn } from '../../utils';

let { ref = $bindable(null), class: className, ...restProps }: AlertDialogPrimitive.OverlayProps = $props();
</script>

<AlertDialogPrimitive.Overlay
	bind:ref
	data-slot="alert-dialog-overlay"
	class={cn(
		"transition-opacity starting:opacity-0 data-[state=closed]:opacity-0 fixed inset-0 z-50 bg-black/50",
		className
	)}
	{...restProps}
/>
