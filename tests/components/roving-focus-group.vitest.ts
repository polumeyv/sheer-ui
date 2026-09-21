import { flushSync } from 'svelte';
import { describe, expect, test } from 'vitest';
import { mountInBody } from '../mount';
import RovingFocusGroupFixture from './roving-focus-group.fixture.svelte';

type GroupName = 'attr' | 'selector' | 'nodes';

type Fixture = {
	setLoop: (value: boolean) => void;
	candidateIds: (group: GroupName) => string[];
	press: (
		group: GroupName,
		fromId: string,
		key: string,
		both?: boolean,
	) => { focusedId: string | null; activeId: string | null; defaultPrevented: boolean };
};

function render() {
	return mountInBody(RovingFocusGroupFixture).component as unknown as Fixture;
}

describe('RovingFocusGroup candidate sources', () => {
	test('the attribute source skips data-disabled, the selector source does not', () => {
		const group = render();
		expect(group.candidateIds('attr')).toEqual(['rfg-a', 'rfg-c', 'rfg-d']);
		expect(group.candidateIds('selector')).toEqual(['rfg-a', 'rfg-b', 'rfg-c', 'rfg-d']);
	});

	test('the candidateNodes source walks tabbables, so the tabindex -1 item drops out', () => {
		const group = render();
		expect(group.candidateIds('nodes')).toEqual(['rfg-a', 'rfg-b', 'rfg-c']);
	});

	test('next and prev move through the candidates and focus them', () => {
		const group = render();
		expect(group.press('attr', 'rfg-a', 'ArrowDown')).toEqual({ focusedId: 'rfg-c', activeId: 'rfg-c', defaultPrevented: true });
		expect(group.press('attr', 'rfg-c', 'ArrowUp')).toEqual({ focusedId: 'rfg-a', activeId: 'rfg-a', defaultPrevented: true });
	});

	test('Home and End jump to the edges', () => {
		const group = render();
		expect(group.press('attr', 'rfg-c', 'Home').focusedId).toBe('rfg-a');
		expect(group.press('attr', 'rfg-a', 'End').focusedId).toBe('rfg-d');
	});

	test('the edges hold when loop is false and wrap when it is true', () => {
		const group = render();
		expect(group.press('attr', 'rfg-a', 'ArrowUp').focusedId).toBe(null);
		expect(group.press('attr', 'rfg-d', 'ArrowDown').focusedId).toBe(null);

		group.setLoop(true);
		flushSync();

		expect(group.press('attr', 'rfg-a', 'ArrowUp').focusedId).toBe('rfg-d');
		expect(group.press('attr', 'rfg-d', 'ArrowDown').focusedId).toBe('rfg-a');
	});

	test('both accepts the cross-axis arrows a vertical group otherwise ignores', () => {
		const group = render();
		const ignored = group.press('attr', 'rfg-a', 'ArrowRight');
		expect(ignored.focusedId).toBe(null);
		expect(ignored.defaultPrevented).toBe(false);

		expect(group.press('attr', 'rfg-a', 'ArrowRight', true).focusedId).toBe('rfg-c');
		expect(group.press('attr', 'rfg-c', 'ArrowLeft', true).focusedId).toBe('rfg-a');
	});

	test('a node outside the candidate set lands on the first candidate', () => {
		const group = render();
		expect(group.press('nodes', 'rfg-d', 'ArrowDown').focusedId).toBe('rfg-a');
	});
});
