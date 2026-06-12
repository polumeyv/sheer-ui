<script lang="ts" module>
	import { cn } from '../../utils';
	import { navigationMenuTriggerStyle } from './variants';
	export { navigationMenuTriggerStyle };
</script>

<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from 'bits-ui';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';

	let { ref = $bindable(null), class: className, children, ...restProps }: NavigationMenuPrimitive.TriggerProps = $props();
</script>

<NavigationMenuPrimitive.Trigger bind:ref data-slot="navigation-menu-trigger" class={cn(navigationMenuTriggerStyle(), 'group', className)} {...restProps}>
	{@render children?.()}

	<ChevronDownIcon class="relative top-[1px] ms-1 size-3 transition duration-300 group-data-[state=open]:rotate-180" aria-hidden="true" />
</NavigationMenuPrimitive.Trigger>
