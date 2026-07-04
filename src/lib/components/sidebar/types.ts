import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { WithElementRef } from '../../internal/utils.js';

export type SidebarSide = 'left' | 'right';
export type SidebarVariant = 'sidebar' | 'floating' | 'inset';
export type SidebarCollapsible = 'offcanvas' | 'icon' | 'none';

export type SidebarRootProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
	side?: SidebarSide;
	variant?: SidebarVariant;
	collapsible?: SidebarCollapsible;
	children?: Snippet;
};
