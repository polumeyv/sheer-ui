<script lang="ts">
import * as DialogPrimitive from './primitive/index';
import { cn } from '../../vendor/utils';

let { ref = $bindable(null), class: className, ...restProps }: DialogPrimitive.OverlayProps = $props();
</script>

<DialogPrimitive.Overlay
	bind:ref
	data-slot="dialog-overlay"
	class={cn(
		"transition-opacity starting:opacity-0 data-[state=closed]:opacity-0 fixed inset-0 z-50 bg-black/50",
		className
	)}
	{...restProps}
/>
