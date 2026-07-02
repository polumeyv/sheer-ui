// Every declareVariants config must be merge-free: no base token may lose to a
// variant token (or vice versa) under the tailwind-merge oracle. Plain join
// never resolves conflicts, so a losing token means the cascade decides — the
// outline-Badge invisible border shipped exactly that way. New axes/values must
// be added here; assertVariantsMergeFree walks the full cartesian product.
import { describe, test } from 'vitest';
import { assertVariantsMergeFree } from 'overrule/test';

import { buttonVariants } from '$lib/components/button/variants.js';
import { emptyMediaVariants } from '$lib/components/empty/variants.js';
import { fieldVariants } from '$lib/components/field/variants.js';
import { inputVariants } from '$lib/components/input/variants.js';
import { sheetVariants } from '$lib/components/sheet/variants.js';
import { toggleVariants } from '$lib/components/toggle/variants.js';

// The .svelte module scripts drag component import chains that construct a
// MediaQuery at module scope, so stub matchMedia before importing them.
Object.defineProperty(window, 'matchMedia', {
	configurable: true,
	value: (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener: () => {},
		removeEventListener: () => {},
		addListener: () => {},
		removeListener: () => {},
		dispatchEvent: () => false,
	}),
});

const { alertVariants } = await import('$lib/components/alert/alert.svelte');
const { badgeVariants } = await import('$lib/components/badge/badge.svelte');
const { itemMediaVariants } = await import('$lib/components/item/item-media.svelte');
const { itemVariants } = await import('$lib/components/item/item.svelte');
const { navigationMenuTriggerStyle } = await import(
	'$lib/components/navigation-menu/components/navigation-menu-trigger.svelte'
);
const { sidebarMenuButtonVariants } = await import('$lib/components/sidebar/sidebar-menu-button.svelte');

// declareVariants fns take literal-union props, narrower than the
// Record<string, string> assertVariantsMergeFree accepts; widen once here.
function check(variants: (props?: never) => string, axes: Record<string, readonly string[]>): void {
	assertVariantsMergeFree(variants as (props?: Record<string, string>) => string, axes);
}

describe('declareVariants configs are merge-free', () => {
	test('alert', () => {
		check(alertVariants, { variant: ['default', 'destructive'] });
	});

	test('badge', () => {
		check(badgeVariants, { variant: ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'] });
	});

	test('button', () => {
		check(buttonVariants, {
			variant: ['default', 'card', 'outline', 'secondary', 'ghost', 'destructive', 'link'],
			size: ['default', 'xs', 'sm', 'lg', 'icon'],
		});
	});

	test('empty media', () => {
		check(emptyMediaVariants, { variant: ['default', 'icon'] });
	});

	test('field', () => {
		check(fieldVariants, { orientation: ['vertical', 'horizontal', 'responsive'] });
	});

	test('input', () => {
		check(inputVariants, { variant: ['default', 'invisible'] });
	});

	test('item', () => {
		check(itemVariants, { variant: ['default', 'outline', 'muted'], size: ['default', 'sm', 'xs'] });
	});

	test('item media', () => {
		check(itemMediaVariants, { variant: ['default', 'icon', 'image'] });
	});

	test('navigation menu trigger', () => {
		check(navigationMenuTriggerStyle, {});
	});

	test('sheet', () => {
		check(sheetVariants, { side: ['top', 'bottom', 'left', 'right'] });
	});

	test('sidebar menu button', () => {
		check(sidebarMenuButtonVariants, { variant: ['default', 'outline'], size: ['default', 'sm', 'lg'] });
	});

	test('toggle', () => {
		check(toggleVariants, { variant: ['default', 'outline'], size: ['default', 'sm', 'lg'] });
	});
});
