import { vi } from 'vitest';

/** jsdom has no showModal/close; this pair models enough for the controller tests. */
export function installNativeDialogPolyfill() {
	Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
		configurable: true,
		value: vi.fn(function (this: HTMLDialogElement) {
			this.open = true;
		}),
	});
	Object.defineProperty(HTMLDialogElement.prototype, 'close', {
		configurable: true,
		value: vi.fn(function (this: HTMLDialogElement) {
			if (!this.open) return;
			this.open = false;
			this.dispatchEvent(new Event('close'));
		}),
	});
}
