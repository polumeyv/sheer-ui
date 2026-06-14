<script lang="ts">
import * as DialogPrimitive from '$lib/components/primitive/dialog/index';
import { cn } from '../../vendor/utils';

let { ref = $bindable(null), class: className, ...restProps }: DialogPrimitive.DescriptionProps = $props();
</script>

<DialogPrimitive.Description
	bind:ref
	data-slot="dialog-description"
	class={cn("text-muted-foreground text-sm", className)}
	{...restProps}
/>
