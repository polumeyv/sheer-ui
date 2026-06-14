<script lang="ts">
import * as SheetPrimitive from '$lib/components/primitive/dialog/index';
import { cn } from '../../vendor/utils';

let { ref = $bindable(null), class: className, ...restProps }: SheetPrimitive.DescriptionProps = $props();
</script>

<SheetPrimitive.Description
	bind:ref
	data-slot="sheet-description"
	class={cn("text-muted-foreground text-sm", className)}
	{...restProps}
/>
