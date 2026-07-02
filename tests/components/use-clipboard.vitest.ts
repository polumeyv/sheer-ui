import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { UseClipboard } from '../../src/lib/blocks/copy-button/copy.svelte.js';

let writeText: ReturnType<typeof vi.fn>;

beforeEach(() => {
	vi.useFakeTimers();
	writeText = vi.fn().mockResolvedValue(undefined);
	Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
});

afterEach(() => {
	vi.useRealTimers();
});

describe('UseClipboard', () => {
	test('successful copy opens the copied window, then returns to idle after delay', async () => {
		const clipboard = new UseClipboard(1000);
		expect(clipboard.status).toBe('idle');

		await expect(clipboard.copy('hello')).resolves.toBe(true);
		expect(clipboard.status).toBe('copied');
		expect(clipboard.copied).toBe(true);
		expect(clipboard.lastCopied).toBe('hello');

		vi.advanceTimersByTime(1000);
		expect(clipboard.status).toBe('idle');
		expect(clipboard.copied).toBe(false);
		expect(clipboard.lastCopied).toBe('hello');
	});

	test('numbers are copied as strings', async () => {
		const clipboard = new UseClipboard();
		await clipboard.copy(42);
		expect(writeText).toHaveBeenCalledWith('42');
		expect(clipboard.lastCopied).toBe('42');
	});

	test('a denied clipboard reports failed and leaves lastCopied untouched', async () => {
		const clipboard = new UseClipboard(1000);
		writeText.mockRejectedValueOnce(new Error('denied'));

		await expect(clipboard.copy('nope')).resolves.toBe(false);
		expect(clipboard.status).toBe('failed');
		expect(clipboard.copied).toBe(false);
		expect(clipboard.lastCopied).toBeUndefined();

		vi.advanceTimersByTime(1000);
		expect(clipboard.status).toBe('idle');
	});

	test('rapid re-copy restarts the feedback window', async () => {
		const clipboard = new UseClipboard(1000);
		await clipboard.copy('one');
		vi.advanceTimersByTime(900);
		await clipboard.copy('two');
		vi.advanceTimersByTime(900);
		expect(clipboard.status).toBe('copied');
		expect(clipboard.lastCopied).toBe('two');
		vi.advanceTimersByTime(100);
		expect(clipboard.status).toBe('idle');
	});

	test('a slow copy that loses to a newer one does not clobber its feedback window', async () => {
		const clipboard = new UseClipboard(1000);
		let resolveSlow!: () => void;
		writeText.mockImplementationOnce(() => new Promise<void>((resolve) => (resolveSlow = resolve)));

		const slow = clipboard.copy('slow');
		await clipboard.copy('fast');
		expect(clipboard.status).toBe('copied');
		expect(clipboard.lastCopied).toBe('fast');

		resolveSlow();
		await expect(slow).resolves.toBe(true);
		expect(clipboard.lastCopied).toBe('fast');
		expect(clipboard.status).toBe('copied');

		vi.advanceTimersByTime(1000);
		expect(clipboard.status).toBe('idle');
	});
});
