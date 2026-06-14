<script lang="ts">
import * as SheetPrimitive from '../dialog/primitive/index';
import { cn } from '../../vendor/utils';

let { ref = $bindable(null), class: className, ...restProps }: SheetPrimitive.OverlayProps = $props();
</script>

<SheetPrimitive.Overlay
	bind:ref
	data-slot="sheet-overlay"
	class={cn(
		"transition-opacity starting:opacity-0 data-[state=closed]:opacity-0 fixed inset-0 z-50 bg-black/50",
		className
	)}
	{...restProps}
/>
