import { BROWSER } from '@polumeyv/utilities/env';
import type { ExternalToast, HeightT, PromiseData, PromiseT, AnyComponent, ToastT, ToastTypes } from './types.js';
import { untrack } from 'svelte';

let toastsCounter = 0;

type UpdateToastProps = {
	id: number | string;
	data: Partial<ToastT>;
	type: ToastTypes;
	message: string | AnyComponent | undefined;
	dismissible: boolean;
};

type CreateToastData<T extends AnyComponent> = ExternalToast<T> & {
	message?: string | T;
	type?: ToastTypes;
	promise?: PromiseT;
};

class ToastState {
	toasts = $state<ToastT[]>([]);
	heights = $state<HeightT[]>([]);

	#findToastIdx = (id: number | string): number | null => {
		const idx = this.toasts.findIndex((toast) => toast.id === id);
		if (idx === -1) return null;
		return idx;
	};

	readonly activeToasts = $derived.by(() => this.toasts.filter((toast) => !toast.dismiss));

	addToast = (data: ToastT): void => {
		if (!BROWSER) return;
		this.toasts.unshift(data);
	};

	updateToast = ({ id, data, type, message, dismissible }: UpdateToastProps): void => {
		const toastIdx = this.#findToastIdx(id);
		if (toastIdx === null) return;

		this.toasts[toastIdx] = {
			...this.toasts[toastIdx],
			...data,
			id,
			title: message,
			type,
			dismissible,
			updated: true,
		};
	};

	create = <T extends AnyComponent>(data: CreateToastData<T>): string | number => {
		const { message, ...rest } = data;
		const id = typeof data.id === 'number' || (data.id && data.id.length > 0) ? data.id : toastsCounter++;

		const dismissible = data.dismissible ?? true;
		const type = data.type ?? 'default';

		untrack(() => {
			const alreadyExists = this.#findToastIdx(id) !== null;

			if (alreadyExists) {
				this.updateToast({ id, data, type, message, dismissible });
				return;
			}

			this.addToast({ ...rest, id, title: message, dismissible, type });
		});

		return id;
	};

	dismiss = (id?: number | string): string | number | undefined => {
		untrack(() => {
			if (id === undefined) {
				this.toasts = this.toasts.map((toast) => ({ ...toast, dismiss: true }));
				return;
			}

			const toastIdx = this.#findToastIdx(id);
			if (toastIdx === null) return;

			this.toasts[toastIdx] = {
				...this.toasts[toastIdx],
				dismiss: true,
			};
		});

		return id;
	};

	remove = (id?: number | string) => {
		if (id === undefined) {
			// remove all toasts
			this.toasts = [];
			return;
		}
		// remove a specific toast
		const toastIdx = this.#findToastIdx(id);
		if (toastIdx === null) return;
		this.toasts.splice(toastIdx, 1);
		return id;
	};

	promise = <ToastData>(promise: PromiseT<ToastData>, data?: PromiseData<ToastData>): string | number | undefined => {
		if (!data) {
			// Nothing to show
			return;
		}
		let id: string | number | undefined = undefined;
		if (data.loading !== undefined) {
			id = this.create({
				...data,
				promise,
				type: 'loading',
				message: typeof data.loading === 'string' ? data.loading : data.loading(),
			});
		}

		const p = promise instanceof Promise ? promise : promise();

		let shouldDismiss = id !== undefined;

		p.then(
			(response) => {
				if (typeof response === 'object' && response && 'ok' in response && typeof response.ok === 'boolean' && !response.ok) {
					shouldDismiss = false;
					const message = constructPromiseErrorMessage(response);
					this.create({ id, type: 'error', message });
				} else if (data.success !== undefined) {
					shouldDismiss = false;
					const message = typeof data.success === 'function' ? data.success(response) : data.success;
					this.create({ id, type: 'success', message });
				}
			},
			(error) => {
				if (data.error !== undefined) {
					shouldDismiss = false;
					const message = typeof data.error === 'function' ? data.error(error) : data.error;

					this.create({ id, type: 'error', message });
				}
			},
		).finally(() => {
			if (shouldDismiss) {
				// Toast is still in load state (and will be indefinitely — dismiss it)
				this.dismiss(id);
				id = undefined;
			}

			data.finally?.();
		});

		return id;
	};

	custom = <T extends AnyComponent>(component: T, data?: ExternalToast<T>): string | number => {
		const id = data?.id || toastsCounter++;

		this.create({ component, id, ...data });

		return id;
	};

	removeHeight = (id: number | string) => {
		this.heights = this.heights.filter((height) => height.toastId !== id);
	};

	setHeight = (data: HeightT) => {
		const toastIdx = this.#findToastIdx(data.toastId);
		if (toastIdx === null) {
			this.heights.push(data);
			return;
		}
		this.heights[toastIdx] = data;
	};

	reset = () => {
		this.toasts = [];
		this.heights = [];
	};
}

const hasStatus = (value: unknown): value is { status: unknown } => value !== null && typeof value === 'object' && 'status' in value;

function constructPromiseErrorMessage(error: unknown) {
	return hasStatus(error) ? `HTTP error! Status: ${error.status}` : `Error! ${String(error)}`;
}

export const toastState = new ToastState();

const basicToast = <T extends AnyComponent>(message: string | T, data?: ExternalToast<T>) =>
	toastState.create({
		message,
		...data,
	});
const createTypedToast =
	(type: ToastTypes) =>
	<T extends AnyComponent>(message: string | T, data?: ExternalToast<T>) =>
		toastState.create({ ...data, type, message });

export const toast = Object.assign(basicToast, {
	success: createTypedToast('success'),
	info: createTypedToast('info'),
	warning: createTypedToast('warning'),
	error: createTypedToast('error'),
	loading: createTypedToast('loading'),
	message: createTypedToast('default'),
	custom: toastState.custom,
	promise: toastState.promise,
	dismiss: toastState.dismiss,
	getActiveToasts: () => toastState.activeToasts,
});
