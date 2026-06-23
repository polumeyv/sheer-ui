/**
 * Test-only registry enumerating every variant axis of every variants.ts config.
 * Used by variants.test.ts to prove class strings stay disjoint (merge-is-a-no-op).
 */
import { buttonVariants } from './button/variants';
import { badgeVariants } from './badge';
import { fieldVariants } from './field/variants';
import { emptyMediaVariants } from './empty/variants';
import { sidebarMenuButtonVariants } from './sidebar/variants';
import { toggleVariants } from './toggle/variants';
import { alertVariants } from './alert';
import { navigationMenuTriggerStyle } from './navigation-menu/components/navigation-menu-trigger.svelte';
import { sheetVariants } from './sheet/variants';

export type RegistryEntry = {
	name: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	fn: (props?: any) => string;
	axes: Record<string, readonly string[]>;
};

export const registry: RegistryEntry[] = [
	{
		name: 'button',
		fn: buttonVariants,
		axes: {
			variant: ['default', 'card', 'outline', 'secondary', 'ghost', 'destructive', 'link'],
			size: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
		},
	},
	{ name: 'badge', fn: badgeVariants, axes: { variant: ['default', 'secondary', 'destructive', 'outline', 'bronze', 'gold', 'platinum'] } },
	{ name: 'field', fn: fieldVariants, axes: { orientation: ['vertical', 'horizontal', 'responsive'] } },
	{ name: 'empty-media', fn: emptyMediaVariants, axes: { variant: ['default', 'icon'] } },
	{
		name: 'sidebar-menu-button',
		fn: sidebarMenuButtonVariants,
		axes: { variant: ['default', 'outline'], size: ['default', 'sm', 'lg'] },
	},
	{ name: 'toggle', fn: toggleVariants, axes: { variant: ['default', 'outline'], size: ['default', 'sm', 'lg'] } },
	{ name: 'alert', fn: alertVariants, axes: { variant: ['default', 'destructive'] } },
	{ name: 'navigation-menu-trigger', fn: navigationMenuTriggerStyle, axes: {} },
	{ name: 'sheet', fn: sheetVariants, axes: { side: ['top', 'bottom', 'left', 'right'] } },
];

/**
 * Compositions built entirely from live variant functions (both sides recompute
 * from source, so these cannot drift). Layerings that involve copied class
 * strings are guarded at runtime by the cn() dev tripwire instead.
 */
export const compositions: [string, () => string][] = [];

/** Cartesian product of every variant axis; `{}` (no axes) yields a single empty combo. */
export function combos(axes: Record<string, readonly string[]>): Record<string, string>[] {
	const keys = Object.keys(axes);
	if (keys.length === 0) return [{}];
	return keys.reduce<Record<string, string>[]>(
		(acc, key) => acc.flatMap((partial) => axes[key].map((value) => ({ ...partial, [key]: value }))),
		[{}],
	);
}

/** Stable, sorted test name for a single variant combo. */
export function comboKey(name: string, combo: Record<string, string>): string {
	const parts = Object.keys(combo)
		.sort()
		.map((k) => `${k}=${combo[k]}`);
	return `${name}|${parts.join(',')}`;
}
