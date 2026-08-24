import { flushSync, mount, tick, unmount } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import CountdownFixture from './countdown.fixture.svelte';

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
	vi.useRealTimers();
	document.body.innerHTML = '';
});

const mountFixture = () => {
	const target = document.createElement('div');
	document.body.append(target);
	const component = mount(CountdownFixture, { target });
	flushSync();
	return component;
};
const shown = () => document.querySelector('output')!.textContent;
const settle = async (ms: number) => {
	await vi.advanceTimersByTimeAsync(ms);
	await tick();
};

describe('createCountdown', () => {
	test('start(seconds) shows the duration at once, counts down on the second boundaries, and re-arms after 0', async () => {
		const component = mountFixture();
		expect(shown()).toBe('0');

		component.start(3);
		flushSync();
		expect(shown()).toBe('3');
		await settle(999);
		expect(shown()).toBe('3');
		await settle(1);
		expect(shown()).toBe('2');
		await settle(2000);
		expect(shown()).toBe('0');

		component.start(2);
		flushSync();
		expect(shown()).toBe('2');
		await settle(2000);
		expect(shown()).toBe('0');
		expect(component.log).toEqual([0, 3, 2, 1, 0, 2, 1, 0]);
		unmount(component);
	});

	test('a later start ends the run in progress; nothing of the ended run reaches the display', async () => {
		const component = mountFixture();
		component.start(3);
		await settle(1500); // mid-sleep towards its `1`
		component.start(5);
		await settle(4000); // spans the ended run's `1` (t=2000) and `0` (t=3000)
		expect(component.log).toEqual([0, 3, 2, 5, 4, 3, 2, 1]);
		unmount(component);
	});

	test('stop() ends the run and clears the display', async () => {
		const component = mountFixture();
		component.start(10);
		await settle(1500);
		expect(shown()).toBe('9');
		component.stop();
		flushSync();
		expect(shown()).toBe('0');
		await settle(5000);
		expect(component.log).toEqual([0, 10, 9, 0]);
		expect(vi.getTimerCount()).toBe(0);
		unmount(component);
	});

	test('unmount ends the run and clears its timer', async () => {
		const component = mountFixture();
		component.start(10);
		await settle(1500);
		unmount(component);
		expect(vi.getTimerCount()).toBe(0);
		await settle(5000);
		expect(component.log).toEqual([0, 10, 9]); // the destroyed component renders nothing further
	});

	test('a tick that arrives late shows the true remainder, not one less', async () => {
		const component = mountFixture();
		component.start(10);
		// A suspended tab: the clock advances 8s while the interval fires once.
		vi.setSystemTime(Date.now() + 8000);
		await settle(1000);
		expect(shown()).toBe('1');
		await settle(1000);
		expect(shown()).toBe('0');
		expect(vi.getTimerCount()).toBe(0);
		unmount(component);
	});
});
