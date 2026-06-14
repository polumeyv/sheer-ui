<script lang="ts">
import * as SheetPrimitive from '$lib/components/primitive/dialog/index';
import { cn } from '../../vendor/utils';

let { ref = $bindable(null), class: className, ...restProps }: SheetPrimitive.TitleProps = $props();
</script>

<SheetPrimitive.Title
	bind:ref
	data-slot="sheet-title"
	class={cn("text-foreground font-semibold", className)}
	{...restProps}
/>
