<script lang="ts">
import { DropdownMenu as DropdownMenuPrimitive } from "$lib/components/_shared/primitives.js";
import { cn } from '../../vendor/utils';

let { ref = $bindable(null), class: className, ...restProps }: DropdownMenuPrimitive.SeparatorProps = $props();
</script>

<DropdownMenuPrimitive.Separator
	bind:ref
	data-slot="dropdown-menu-separator"
	class={cn("bg-border -mx-1 my-1 h-px", className)}
	{...restProps}
/>
