// Every declareVariants config must be merge-free: no base token may lose to a
// variant token (or vice versa) under the conflict oracle. Plain join never
// resolves conflicts, so a losing token means the cascade decides — the
// outline-Badge invisible border shipped exactly that way. New axes/values
// must be added here; the full cartesian product of each config is judged.
//
// Verdicts come from `overrule judge` (the same patched-tables engine the CI
// class gates run, equivalence-tested against tailwind-merge upstream), so
// tailwind-merge itself never executes here. OVERRULE_BIN overrides the
// binary for pre-release testing.
import { execFileSync } from 'node:child_process';
import { describe, expect, test } from 'vitest';

import { buttonVariants } from '#lib/components/button/variants.js';
import { emptyMediaVariants } from '#lib/components/empty/variants.js';
import { fieldVariants } from '#lib/components/field/variants.js';
import { inputVariants } from '#lib/components/input/variants.js';
import { sheetVariants } from '#lib/components/sheet/variants.js';
import { toggleVariants } from '#lib/components/toggle/variants.js';

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

const { alertVariants } = await import('#lib/components/alert/alert.svelte');
const { badgeVariants } = await import('#lib/components/badge/badge.svelte');
const { itemMediaVariants } = await import('#lib/components/item/item-media.svelte');
const { itemVariants } = await import('#lib/components/item/item.svelte');
const { navigationMenuTriggerStyle } = await import('#lib/components/navigation-menu/components/navigation-menu-trigger.svelte');
const { sidebarMenuButtonVariants } = await import('#lib/components/sidebar/sidebar-menu-button.svelte');

const BIN = process.env.OVERRULE_BIN ?? 'node_modules/.bin/overrule';

function combos(axes: Record<string, readonly string[]>): Record<string, string>[] {
	let out: Record<string, string>[] = [{}];
	for (const [axis, values] of Object.entries(axes)) {
		out = out.flatMap((combo) => values.map((value) => ({ ...combo, [axis]: value })));
	}
	return out;
}

function check(variants: (props?: never) => string, axes: Record<string, readonly string[]>): void {
	const all = combos(axes);
	const strings = all.map((combo) => (variants as (props?: Record<string, string>) => string)(combo));
	// judge skips blank stdin lines, which would desync the verdict order.
	for (const s of strings) expect(s).not.toBe('');

	let stdout: string;
	try {
		stdout = execFileSync(BIN, ['judge', '--json'], { input: strings.join('\n') + '\n', encoding: 'utf8' });
	} catch (error) {
		// Exit 1 means conflicts and the verdicts are on stdout; anything
		// without stdout is a broken or pre-judge binary and must fail loudly.
		stdout = (error as { stdout?: string }).stdout ?? '';
		if (!stdout) throw error;
	}

	const verdicts = JSON.parse(stdout).verdicts as { literal: string; dropped: string[] }[];
	expect(verdicts).toHaveLength(strings.length);
	const failures = verdicts.flatMap((verdict, i) =>
		verdict.dropped.length > 0
			? [`combo ${JSON.stringify(all[i])}: "${verdict.dropped.join(' ')}" would be dropped from "${verdict.literal}"`]
			: [],
	);
	expect(failures).toEqual([]);
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
