export { default as Root } from "$lib/components/navigation-menu/primitive/components/navigation-menu.svelte";
export { default as Content } from "$lib/components/navigation-menu/primitive/components/navigation-menu-content.svelte";
export { default as Indicator } from "$lib/components/navigation-menu/primitive/components/navigation-menu-indicator.svelte";
export { default as Item } from "$lib/components/navigation-menu/primitive/components/navigation-menu-item.svelte";
export { default as Link } from "$lib/components/navigation-menu/primitive/components/navigation-menu-link.svelte";
export { default as List } from "$lib/components/navigation-menu/primitive/components/navigation-menu-list.svelte";
export { default as Trigger } from "$lib/components/navigation-menu/primitive/components/navigation-menu-trigger.svelte";
export { default as Viewport } from "$lib/components/navigation-menu/primitive/components/navigation-menu-viewport.svelte";
export { default as Sub } from "$lib/components/navigation-menu/primitive/components/navigation-menu-sub.svelte";

export type {
	NavigationMenuRootProps as RootProps,
	NavigationMenuItemProps as ItemProps,
	NavigationMenuListProps as ListProps,
	NavigationMenuTriggerProps as TriggerProps,
	NavigationMenuViewportProps as ViewportProps,
	NavigationMenuIndicatorProps as IndicatorProps,
	NavigationMenuContentProps as ContentProps,
	NavigationMenuLinkProps as LinkProps,
	NavigationMenuSubProps as SubProps,
} from "$lib/components/navigation-menu/primitive/index.js";
