import { flushSync, tick } from 'svelte';
import { describe, expect, test } from 'vitest';
import { el, render } from '../harness.js';
import DismissableLayerFixture from './dismissable-layer.fixture.svelte';

// Exercises the real $effect/onMount-driven dismissible layer (use-dismissable-layer.svelte.ts)
// against the shared bitsDismissableLayers stack. Every timer the layer uses — the 1ms
// registration gate, the 10ms interact-outside debounce, and the 20ms reset — is routed through
// an injected Scheduler seam (scheduler.ts); the fixture injects a manual clock so the fragile
// timing is deterministic, exactly mirroring how presence-manager.vitest.ts drives PresenceManager
// through its injected AfterAnimationsRunner.

function firePointerDown(node: EventTarget, init: PointerEventInit = {}) {
	node.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, clientX: 50, clientY: 50, ...init }));
}

describe('dismissible (interact-outside) layer', () => {
	test('(a) registration gate: an outside pointerdown before the 1ms gate is ignored; after it, it dismisses', () => {
		const { component } = render(DismissableLayerFixture);
		// Gate scheduled by the mount effect but not yet fired → no document listeners exist.
		firePointerDown(el('outside'));
		// The only pending timer is the gate; the ignored event scheduled no 10ms debounce.
		expect(component.pendingDelays()).toContain(1);
		expect(component.pendingDelays()).not.toContain(10);
		expect(component.dismissA()).toBe(0);

		component.advance(1); // fire the gate → register + attach listeners
		expect(component.dismissA()).toBe(0); // the earlier event was never captured

		firePointerDown(el('outside')); // now there IS a listener
		component.advance(10); // fire the debounced dismiss
		expect(component.dismissA()).toBe(1);
	});

	test('(b) responsibility: with two layers registered, only the topmost handles an outside pointerdown', () => {
		const { component } = render(DismissableLayerFixture, { withB: true });
		component.advance(1); // fire BOTH gates → A registers, then B (registered last = topmost)
		firePointerDown(el('outside'));
		component.advance(10);
		expect(component.dismissA()).toBe(0); // A is not the responsible layer
		expect(component.dismissB()).toBe(1); // B is
	});

	test('(c) a pointerdown inside the layer never dismisses', () => {
		const { component } = render(DismissableLayerFixture);
		component.advance(1);
		firePointerDown(el('inside-a'), { clientX: 0, clientY: 0 });
		component.advance(10);
		expect(component.dismissA()).toBe(0);
	});

	test('(d) the 10ms interact-outside debounce collapses rapid successive events into one dismiss', () => {
		const { component } = render(DismissableLayerFixture);
		component.advance(1);

		firePointerDown(el('outside')); // schedules the dismiss at +10
		component.advance(5); // still inside the window
		expect(component.dismissA()).toBe(0);

		firePointerDown(el('outside')); // reschedules — collapses with the first
		component.advance(10); // fire the single debounced dismiss
		expect(component.dismissA()).toBe(1);
	});

	test('(e) the 20ms reset: teardown cancels the in-flight interact-outside and schedules the reset', () => {
		const { component } = render(DismissableLayerFixture);
		component.advance(1);

		firePointerDown(el('outside')); // schedules a 10ms interact-outside
		expect(component.pendingDelays()).toContain(10);

		component.setAEnabled(false); // effect teardown
		flushSync();

		const delays = component.pendingDelays();
		expect(delays).toContain(20); // the reset window is scheduled...
		expect(delays).not.toContain(10); // ...and the pending interact-outside was cancelled

		component.advance(20); // the reset fires cleanly; the cancelled dismiss never ran
		expect(component.dismissA()).toBe(0);
		expect(component.pendingDelays()).toEqual([]);
	});

	test('(f) a defaultPrevented outside event reaches the callback through the reset proxy', () => {
		const { component } = render(DismissableLayerFixture);
		component.advance(1);

		const outside = el('outside');
		// Mark the event defaultPrevented during dispatch; the layer reads it 10ms later.
		outside.addEventListener('pointerdown', (e) => e.preventDefault(), { once: true });
		outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, clientX: 50, clientY: 50 }));
		component.advance(10);

		expect(component.dismissA()).toBe(1);
		const received = component.lastA();
		expect(received).toBeDefined();
		// The proxy hands the consumer a fresh event whose prevented-state is reset to false...
		expect(received!.defaultPrevented).toBe(false);
		// ...so the consumer can veto independently.
		received!.preventDefault();
		expect(received!.defaultPrevented).toBe(true);
	});

	test('(h) the optional opts are genuinely optional: an outside focusin with no onFocusOutside is a no-op', async () => {
		// The fixture supplies neither onFocusOutside nor isValidEvent, so this drives both absent paths:
		// the focusin handler must not fault, and the pointerdown validity check falls back to the built-in.
		const { component } = render(DismissableLayerFixture);
		component.advance(1);

		el('outside').dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
		await tick(); // #handleFocus defers its outside check through tick()
		flushSync();

		firePointerDown(el('outside'));
		component.advance(10);
		expect(component.dismissA()).toBe(1);
	});

	test('(g) touch: dismissal defers to the following click (pointerType fallback path)', () => {
		const { component } = render(DismissableLayerFixture);
		component.advance(1);

		// This jsdom honors PointerEvent.pointerType, so the touch branch is genuinely reachable.
		expect(new PointerEvent('pointerdown', { pointerType: 'touch' }).pointerType).toBe('touch');

		firePointerDown(el('outside'), { pointerType: 'touch' });
		component.advance(10);
		expect(component.dismissA()).toBe(0); // touch does NOT dismiss on pointerdown...

		document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(component.dismissA()).toBe(1); // ...it dismisses on the following click
	});
});
