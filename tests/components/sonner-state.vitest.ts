import { beforeEach, describe, expect, test } from 'vitest';
import { toast, toastState } from '../../src/lib/components/sonner/toast-state.svelte.js';

beforeEach(() => {
	toastState.reset();
});

describe('ToastState heights', () => {
	test('new heights land at the front, mirroring toast order', () => {
		const a = toast('a');
		const b = toast('b');
		// toasts are unshifted: [b, a]; heights arrive in mount order and must end up aligned
		toastState.setHeight({ toastId: a, height: 40 });
		toastState.setHeight({ toastId: b, height: 60 });

		expect(toastState.toasts.map((t) => t.id)).toEqual([b, a]);
		expect(toastState.heights.map((h) => h.toastId)).toEqual([b, a]);
	});

	test('re-measuring updates in place without losing another toast height', () => {
		const a = toast('a');
		const b = toast('b');
		toastState.setHeight({ toastId: a, height: 40 });
		toastState.setHeight({ toastId: b, height: 60 });

		toastState.setHeight({ toastId: a, height: 44 });

		expect(toastState.heights).toHaveLength(2);
		expect(toastState.heights.find((h) => h.toastId === a)?.height).toBe(44);
		expect(toastState.heights.find((h) => h.toastId === b)?.height).toBe(60);
	});

	test('removeHeight drops only the matching entry', () => {
		const a = toast('a');
		const b = toast('b');
		toastState.setHeight({ toastId: a, height: 40 });
		toastState.setHeight({ toastId: b, height: 60 });

		toastState.removeHeight(a);
		expect(toastState.heights.map((h) => h.toastId)).toEqual([b]);
	});
});

describe('ToastState dismiss', () => {
	test('dismiss flags the toast without removing it; remove drops it', () => {
		const id = toast('bye');
		toastState.dismiss(id);
		expect(toastState.toasts.find((t) => t.id === id)?.dismiss).toBe(true);
		expect(toastState.activeToasts).toHaveLength(0);
		expect(toastState.toasts).toHaveLength(1);

		toastState.remove(id);
		expect(toastState.toasts).toHaveLength(0);
	});

	test('dismiss with no id flags every toast', () => {
		toast('one');
		toast('two');
		toastState.dismiss();
		expect(toastState.toasts.every((t) => t.dismiss)).toBe(true);
	});
});
