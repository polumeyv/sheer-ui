import { flushSync } from 'svelte';
import { describe, expect, test } from 'vitest';
import { render, text } from '../harness.js';
import EscapeLayerStackFixture from './escape-layer-stack.fixture.svelte';

// This exercises the real Svelte $effect-driven register/unregister wiring in
// use-escape-layer.svelte.ts against the shared createLayerStack, complementing the pure
// algorithm tests in internal/layer-stack.test.ts.

function count(which: 'a' | 'b') {
	return Number(text(`${which}-count`));
}

function pressEscape() {
	document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
	flushSync();
}

describe('escape-layer stack (nested overlays)', () => {
	test('both close-behavior: the later-registered (topmost) layer handles Escape, not the earlier one', () => {
		render(EscapeLayerStackFixture, { aBehavior: 'close', bBehavior: 'close' });
		pressEscape();
		expect(count('a')).toBe(0);
		expect(count('b')).toBe(1);
	});

	test('once the topmost layer unmounts, the remaining layer becomes responsible', () => {
		const { component } = render(EscapeLayerStackFixture, { aBehavior: 'close', bBehavior: 'close', bEnabled: true });
		pressEscape();
		expect(count('b')).toBe(1);

		// B's overlay closes/unmounts (its element is removed, deregistering it)
		component.setBEnabled(false);
		flushSync();

		pressEscape();
		expect(count('a')).toBe(1);
		expect(count('b')).toBe(1); // unchanged — B no longer receives anything
	});

	test('a deferring layer never handles Escape while a closing layer is registered', () => {
		render(EscapeLayerStackFixture, { aBehavior: 'close', bBehavior: 'defer-otherwise-close' });
		pressEscape();
		expect(count('a')).toBe(1);
		expect(count('b')).toBe(0);
	});

	test('a disabled layer does not intercept Escape even if registered last', () => {
		render(EscapeLayerStackFixture, { aBehavior: 'close', bBehavior: 'close', bEnabled: false });
		pressEscape();
		expect(count('a')).toBe(1);
		expect(count('b')).toBe(0);
	});
});
