<script lang="ts">
import * as SheetPrimitive from '../dialog/primitive/index.js';
import { cn } from '../../vendor/utils.js';

let { ref = $bindable(null), class: className, ...restProps }: SheetPrimitive.TitleProps = $props();
</script>

<SheetPrimitive.Title
	bind:ref
	data-slot="sheet-title"
	class={cn("text-foreground font-semibold", className)}
	{...restProps}
/>
