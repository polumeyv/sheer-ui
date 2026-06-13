<script lang="ts">
import { Drawer as DrawerPrimitive } from 'vaul-svelte';
import { cn } from '../../vendor/utils';

let { ref = $bindable(null), class: className, ...restProps }: DrawerPrimitive.OverlayProps = $props();
</script>

<DrawerPrimitive.Overlay
	bind:ref
	data-slot="drawer-overlay"
	class={cn(
		"transition-opacity starting:opacity-0 data-[state=closed]:opacity-0 fixed inset-0 z-50 bg-black/50",
		className
	)}
	{...restProps}
/>
