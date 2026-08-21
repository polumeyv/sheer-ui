import { flushSync, mount, tick, unmount } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import CountdownFixture from './countdown.fixture.svelte';

afterEach(() => {
	vi.useRealTimers();
	document.body.innerHTML = '';
});

const shown = () => document.querySelector('output')!.textContent;
const settle = async (ms: number) => {
	await vi.advanceTimersByTimeAsync(ms);
	await tick();
};

describe('createCountdown', () => {
	test('start(seconds) counts down to 0 and a later start restarts from its own duration', async () => {
		vi.useFakeTimers();
		const target = document.createElement('div');
		document.body.append(target);
		const component = mount(CountdownFixture, { target });
		flushSync();
		expect(shown()).toBe('0');

		component.start(3);
		await settle(0);
		expect(shown()).toBe('3');
		await settle(1000);
		expect(shown()).toBe('2');

		component.start(5); // the 3s run is ended; its next tick must not write a stale 1
		await settle(0);
		expect(shown()).toBe('5');
		await settle(1000);
		expect(shown()).toBe('4');
		await settle(4000);
		expect(shown()).toBe('0');

		unmount(component);
	});

	test('unmount ends the run', async () => {
		vi.useFakeTimers();
		const target = document.createElement('div');
		document.body.append(target);
		const component = mount(CountdownFixture, { target });
		flushSync();
		component.start(10);
		await settle(1000);
		unmount(component);
		await expect(settle(5000)).resolves.toBeUndefined();
		expect(vi.getTimerCount()).toBe(0);
	});
});
