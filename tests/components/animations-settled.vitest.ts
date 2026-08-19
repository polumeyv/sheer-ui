import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import AnimationsSettledFixture from './animations-settled.fixture.svelte';

function render() {
	const target = document.createElement('div');
	document.body.append(target);
	const component = mount(AnimationsSettledFixture, { target });
	flushSync();
	return component;
}

// jsdom has neither getAnimations nor Animation, so the runner's animation input is stubbed.
function fakeAnimation(iterations: number) {
	let settle: () => void = () => {};
	let cancel: () => void = () => {};
	const finished = new Promise<void>((resolve, reject) => {
		settle = resolve;
		cancel = () => reject(new DOMException('cancelled', 'AbortError'));
	});
	finished.catch(() => {});
	return { effect: { getComputedTiming: () => ({ iterations }) }, playState: 'running', finished, settle, cancel };
}

function stubAnimations(node: HTMLElement, animations: ReturnType<typeof fakeAnimation>[]) {
	node.getAnimations = () => animations as unknown as Animation[];
}

const frames = async (count = 3) => {
	for (let i = 0; i < count; i++) await new Promise(requestAnimationFrame);
};

afterEach(() => {
	document.body.innerHTML = '';
});

describe('createSettleRunner', () => {
	test('a second run supersedes the first', async () => {
		const c = render();
		stubAnimations(c.getNode(), []);
		const calls: string[] = [];

		c.run(() => calls.push('first'));
		c.run(() => calls.push('second'));

		await vi.waitFor(() => expect(calls).toEqual(['second']));
		await frames();
		expect(calls).toEqual(['second']);
		unmount(c);
	});

	test('a null node cancels the pending run and drops the new one', async () => {
		const c = render();
		const animation = fakeAnimation(1);
		stubAnimations(c.getNode(), [animation]);
		const calls: string[] = [];

		c.run(() => calls.push('pending'));
		await frames(2);
		c.runWithoutNode(() => calls.push('dropped'));
		animation.settle();

		await frames();
		expect(calls).toEqual([]);
		unmount(c);
	});

	test('an infinite animation is excluded instead of stranding the callback', async () => {
		const c = render();
		// `finished` never resolves for iterations: Infinity — waiting on it hangs the caller.
		stubAnimations(c.getNode(), [fakeAnimation(Infinity)]);
		const calls: string[] = [];

		c.run(() => calls.push('fired'));

		await vi.waitFor(() => expect(calls).toEqual(['fired']));
		unmount(c);
	});

	test('a cancelled animation re-queries and waits for its replacement', async () => {
		const c = render();
		const enter = fakeAnimation(1);
		const exit = fakeAnimation(1);
		// close-during-enter: the browser cancels the enter transition and starts the exit
		let queries = 0;
		c.getNode().getAnimations = () => [queries++ === 0 ? enter : exit] as unknown as Animation[];
		const calls: string[] = [];

		c.run(() => calls.push('fired'));
		await frames(2);
		enter.cancel();
		await frames(2);
		expect(calls).toEqual([]);

		exit.settle();
		await vi.waitFor(() => expect(calls).toEqual(['fired']));
		unmount(c);
	});

	test('unmount cancels a pending run', async () => {
		const c = render();
		const animation = fakeAnimation(1);
		stubAnimations(c.getNode(), [animation]);
		const calls: string[] = [];

		c.run(() => calls.push('fired'));
		await frames(2);
		unmount(c);
		animation.settle();

		await frames();
		expect(calls).toEqual([]);
	});
});
