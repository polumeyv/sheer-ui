<script lang="ts">
import { cn } from '../../vendor/utils';
import { Menubar as MenubarPrimitive } from "$lib/components/_shared/primitives";
import type { ComponentProps } from 'svelte';

let {
	ref = $bindable(null),
	inset,
	class: className,
	...restProps
}: ComponentProps<typeof MenubarPrimitive.GroupHeading> & {
	inset?: boolean;
} = $props();
</script>

<MenubarPrimitive.GroupHeading
	bind:ref
	data-slot="menubar-group-heading"
	data-inset={inset}
	class={cn("px-2 py-1.5 text-sm font-medium data-[inset]:ps-8", className)}
	{...restProps}
/>
