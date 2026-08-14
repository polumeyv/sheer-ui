import { afterEach, describe, expect, test } from 'vitest';
import { createAccessibleHeading, pickerOpenFocus } from '../../src/lib/internal/date-time/calendar-helpers.svelte.js';
import { focusFirst } from '../../src/lib/internal/focus.js';
import { getTabbableFrom, getTabbableFromFocusable } from '../../src/lib/internal/tabbable.js';
import { DOMContext } from '../../src/lib/internal/tools/utils/dom-context.svelte.js';

function foreignDocument() {
	const iframe = document.createElement('iframe');
	document.body.append(iframe);
	if (!iframe.contentDocument) throw new Error('Expected iframe document');
	return iframe.contentDocument;
}

afterEach(() => {
	document.body.innerHTML = '';
});

describe('getDocument caller behavior', () => {
	test('getTabbableFrom searches the current element owning document', () => {
		const doc = foreignDocument();
		const current = doc.createElement('button');
		const next = doc.createElement('button');
		doc.body.append(current, next);

		expect(getTabbableFrom(current, 'next')).toBe(next);
	});

	test('getTabbableFromFocusable searches the current element owning document', () => {
		const doc = foreignDocument();
		const current = doc.createElement('button');
		const next = doc.createElement('button');
		doc.body.append(current, next);

		expect(getTabbableFromFocusable(current, 'next')).toBe(next);
	});

	test('createAccessibleHeading creates and removes nodes in the calendar owning document', () => {
		const doc = foreignDocument();
		const calendarNode = doc.createElement('div');
		doc.body.append(calendarNode);

		const cleanup = createAccessibleHeading({
			calendarNode,
			label: 'Calendar July 2026',
			accessibleHeadingId: 'foreign-calendar-heading',
		});

		expect(doc.getElementById('foreign-calendar-heading')).not.toBeNull();
		expect(document.getElementById('foreign-calendar-heading')).toBeNull();
		cleanup();
		expect(doc.getElementById('foreign-calendar-heading')).toBeNull();
	});

	test('pickerOpenFocus focuses the marked day in the event target owning document', () => {
		const doc = foreignDocument();
		const trigger = doc.createElement('button');
		const day = doc.createElement('button');
		day.dataset.bitsDay = '';
		day.dataset.focused = '';
		doc.body.append(trigger, day);
		trigger.addEventListener('pointerdown', pickerOpenFocus);

		trigger.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));

		expect(doc.activeElement).toBe(day);
	});

	test('focusFirst observes and changes focus in the candidate owning document', () => {
		const doc = foreignDocument();
		const candidate = doc.createElement('button');
		doc.body.append(candidate);

		expect(focusFirst([candidate], {}, () => doc.activeElement)).toBe(true);
		expect(doc.activeElement).toBe(candidate);
	});

	test('DOMContext resolves the document from its current element', () => {
		const doc = foreignDocument();
		const element = doc.createElement('div');
		doc.body.append(element);
		const context = new DOMContext(() => element);

		expect(context.getDocument()).toBe(doc);
	});
});
