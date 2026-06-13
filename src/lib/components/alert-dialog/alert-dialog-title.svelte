<script lang="ts">
import * as DialogPrimitive from '../dialog/primitive/index.js';
import { cn } from '../../utils';

let { ref = $bindable(null), class: className, ...restProps }: DialogPrimitive.TitleProps = $props();
</script>

<DialogPrimitive.Title
	bind:ref
	data-slot="alert-dialog-title"
	class={cn("text-lg font-semibold", className)}
	{...restProps}
/>
