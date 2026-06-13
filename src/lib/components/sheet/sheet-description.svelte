<script lang="ts">
import * as SheetPrimitive from '../dialog/primitive/index.js';
import { cn } from '../../utils';

let { ref = $bindable(null), class: className, ...restProps }: SheetPrimitive.DescriptionProps = $props();
</script>

<SheetPrimitive.Description
	bind:ref
	data-slot="sheet-description"
	class={cn("text-muted-foreground text-sm", className)}
	{...restProps}
/>
