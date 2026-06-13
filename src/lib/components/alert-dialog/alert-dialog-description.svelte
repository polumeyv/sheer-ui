<script lang="ts">
import * as DialogPrimitive from '../dialog/primitive/index.js';
import { cn } from '../../utils';

let { ref = $bindable(null), class: className, ...restProps }: DialogPrimitive.DescriptionProps = $props();
</script>

<DialogPrimitive.Description
	bind:ref
	data-slot="alert-dialog-description"
	class={cn("text-muted-foreground text-sm", className)}
	{...restProps}
/>
