<script lang="ts">
import { Menubar as MenubarPrimitive } from "$lib/components/_shared/primitives.js";
import { cn } from '../../vendor/utils';

let { ref = $bindable(null), class: className, ...restProps }: MenubarPrimitive.SeparatorProps = $props();
</script>

<MenubarPrimitive.Separator
	bind:ref
	data-slot="menubar-separator"
	class={cn("bg-border -mx-1 my-1 h-px", className)}
	{...restProps}
/>
