import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, test } from 'vitest';
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
	const target = document.createElement('div');
	document.body.append(target);
	const component = mount(RovingFocusGroupFixture, { target }) as unknown as Fixture;
	flushSync();
	return component;
}

afterEach(() => {
	document.body.innerHTML = '';
});

describe('RovingFocusGroup candidate sources', () => {
	test('the attribute source skips data-disabled, the selector source does not', () => {
		const group = render();
		try {
			expect(group.candidateIds('attr')).toEqual(['rfg-a', 'rfg-c', 'rfg-d']);
			expect(group.candidateIds('selector')).toEqual(['rfg-a', 'rfg-b', 'rfg-c', 'rfg-d']);
		} finally {
			unmount(group);
		}
	});

	test('the candidateNodes source walks tabbables, so the tabindex -1 item drops out', () => {
		const group = render();
		try {
			expect(group.candidateIds('nodes')).toEqual(['rfg-a', 'rfg-b', 'rfg-c']);
		} finally {
			unmount(group);
		}
	});

	test('next and prev move through the candidates and focus them', () => {
		const group = render();
		try {
			expect(group.press('attr', 'rfg-a', 'ArrowDown')).toEqual({ focusedId: 'rfg-c', activeId: 'rfg-c', defaultPrevented: true });
			expect(group.press('attr', 'rfg-c', 'ArrowUp')).toEqual({ focusedId: 'rfg-a', activeId: 'rfg-a', defaultPrevented: true });
		} finally {
			unmount(group);
		}
	});

	test('Home and End jump to the edges', () => {
		const group = render();
		try {
			expect(group.press('attr', 'rfg-c', 'Home').focusedId).toBe('rfg-a');
			expect(group.press('attr', 'rfg-a', 'End').focusedId).toBe('rfg-d');
		} finally {
			unmount(group);
		}
	});

	test('the edges hold when loop is false and wrap when it is true', () => {
		const group = render();
		try {
			expect(group.press('attr', 'rfg-a', 'ArrowUp').focusedId).toBe(null);
			expect(group.press('attr', 'rfg-d', 'ArrowDown').focusedId).toBe(null);

			group.setLoop(true);
			flushSync();

			expect(group.press('attr', 'rfg-a', 'ArrowUp').focusedId).toBe('rfg-d');
			expect(group.press('attr', 'rfg-d', 'ArrowDown').focusedId).toBe('rfg-a');
		} finally {
			unmount(group);
		}
	});

	test('both accepts the cross-axis arrows a vertical group otherwise ignores', () => {
		const group = render();
		try {
			const ignored = group.press('attr', 'rfg-a', 'ArrowRight');
			expect(ignored.focusedId).toBe(null);
			expect(ignored.defaultPrevented).toBe(false);

			expect(group.press('attr', 'rfg-a', 'ArrowRight', true).focusedId).toBe('rfg-c');
			expect(group.press('attr', 'rfg-c', 'ArrowLeft', true).focusedId).toBe('rfg-a');
		} finally {
			unmount(group);
		}
	});

	test('a node outside the candidate set lands on the first candidate', () => {
		const group = render();
		try {
			expect(group.press('nodes', 'rfg-d', 'ArrowDown').focusedId).toBe('rfg-a');
		} finally {
			unmount(group);
		}
	});
});
