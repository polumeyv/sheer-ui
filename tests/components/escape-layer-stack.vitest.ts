import { flushSync } from 'svelte';
import { describe, expect, test } from 'vitest';
import { mountInBody } from '../mount';
import EscapeLayerStackFixture from './escape-layer-stack.fixture.svelte';

// This exercises the real Svelte $effect-driven register/unregister wiring in
// use-escape-layer.svelte.ts against the shared createLayerStack, complementing the pure
// algorithm tests in internal/layer-stack.test.ts.

function render(props: Partial<{ aBehavior: string; bBehavior: string; aEnabled: boolean; bEnabled: boolean }> = {}) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return mountInBody(EscapeLayerStackFixture, props as any);
}

function count(target: HTMLElement, which: 'a' | 'b') {
	const node = target.querySelector(`[data-testid="${which}-count"]`);
	if (!node) throw new Error(`missing ${which}-count`);
	return Number(node.textContent);
}

function pressEscape() {
	document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
	flushSync();
}

describe('escape-layer stack (nested overlays)', () => {
	test('both close-behavior: the later-registered (topmost) layer handles Escape, not the earlier one', () => {
		const { target } = render({ aBehavior: 'close', bBehavior: 'close' });
		pressEscape();
		expect(count(target, 'a')).toBe(0);
		expect(count(target, 'b')).toBe(1);
	});

	test('once the topmost layer unmounts, the remaining layer becomes responsible', () => {
		const { component, target } = render({ aBehavior: 'close', bBehavior: 'close', bEnabled: true });
		pressEscape();
		expect(count(target, 'b')).toBe(1);

		// B's overlay closes/unmounts (its element is removed, deregistering it)
		component.setBEnabled(false);
		flushSync();

		pressEscape();
		expect(count(target, 'a')).toBe(1);
		expect(count(target, 'b')).toBe(1); // unchanged — B no longer receives anything
	});

	test('a deferring layer never handles Escape while a closing layer is registered', () => {
		const { target } = render({ aBehavior: 'close', bBehavior: 'defer-otherwise-close' });
		pressEscape();
		expect(count(target, 'a')).toBe(1);
		expect(count(target, 'b')).toBe(0);
	});

	test('a disabled layer does not intercept Escape even if registered last', () => {
		const { target } = render({ aBehavior: 'close', bBehavior: 'close', bEnabled: false });
		pressEscape();
		expect(count(target, 'a')).toBe(1);
		expect(count(target, 'b')).toBe(0);
	});
});
