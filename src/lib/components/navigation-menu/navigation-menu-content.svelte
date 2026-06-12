<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from 'bits-ui';
	import { cn } from '../../utils';

	let { ref = $bindable(null), class: className, ...restProps }: NavigationMenuPrimitive.ContentProps = $props();
</script>

<NavigationMenuPrimitive.Content
	bind:ref
	data-slot="navigation-menu-content"
	class={cn(
		'transition-[opacity,scale,translate] data-[motion^=from-]:starting:opacity-0 data-[motion^=to-]:opacity-0 data-[motion=from-end]:starting:translate-x-52 data-[motion=from-start]:starting:-translate-x-52 data-[motion=to-end]:translate-x-52 data-[motion=to-start]:-translate-x-52 inset-s-0 top-0 w-full p-2 pe-2.5 md:absolute md:w-auto',
		'group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:starting:opacity-0 group-data-[viewport=false]/navigation-menu:starting:scale-95 group-data-[viewport=false]/navigation-menu:data-[state=closed]:opacity-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:scale-95 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none',
		className,
	)}
	{...restProps} />
