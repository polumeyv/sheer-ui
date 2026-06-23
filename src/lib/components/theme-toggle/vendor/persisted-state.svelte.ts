// Vendored from runed (PersistedState) to keep the mode-watcher engine
// self-contained. Reactive state persisted and synced across tabs via Web Storage.
// Source: https://runed.dev/docs/utilities/persisted-state
import { BROWSER } from 'esm-env';
import { on } from 'svelte/events';
import { createSubscriber } from 'svelte/reactivity';

const defaultWindow = BROWSER && typeof window !== 'undefined' ? window : undefined;

type Serializer<T> = {
	serialize: (value: T) => string;
	deserialize: (value: string) => T | undefined;
};

type StorageType = 'local' | 'session';

type PersistedStateOptions<T> = {
	/** The storage type to use. Defaults to `local`. */
	storage?: StorageType;
	/** The serializer to use. Defaults to `JSON.stringify` and `JSON.parse`. */
	serializer?: Serializer<T>;
	/** Whether to sync with the state changes from other tabs. Defaults to `true`. */
	syncTabs?: boolean;
	/** The window object to use. Defaults to the global `window`. */
	window?: Window;
};

function getStorage(storageType: StorageType, window: Window): Storage {
	switch (storageType) {
		case 'local':
			return window.localStorage;
		case 'session':
			return window.sessionStorage;
	}
}

/**
 * Creates reactive state that is persisted and synchronized across browser
 * sessions and tabs using Web Storage.
 */
export class PersistedState<T> {
	#current: T;
	#key: string;
	#serializer: Serializer<T>;
	#storage?: Storage;
	#subscribe?: () => void;
	#version = $state(0);

	constructor(key: string, initialValue: T, options: PersistedStateOptions<T> = {}) {
		const {
			storage: storageType = 'local',
			serializer = { serialize: JSON.stringify, deserialize: JSON.parse },
			syncTabs = true,
			window = defaultWindow
		} = options;

		this.#current = initialValue;
		this.#key = key;
		this.#serializer = serializer;

		if (window === undefined) return;

		const storage = getStorage(storageType, window);
		this.#storage = storage;

		const existingValue = storage.getItem(key);
		if (existingValue !== null) {
			this.#current = this.#deserialize(existingValue) ?? this.#current;
		} else {
			this.#serialize(initialValue);
		}

		if (syncTabs && storageType === 'local') {
			this.#subscribe = createSubscriber(() => on(window, 'storage', this.#handleStorageEvent));
		}
	}

	get current(): T {
		this.#subscribe?.();
		this.#version;
		const root = this.#deserialize(this.#storage?.getItem(this.#key) ?? null) ?? this.#current;
		const proxies = new WeakMap();
		const proxy = (value: unknown): unknown => {
			if (value === null || (value as object)?.constructor.name === 'Date' || typeof value !== 'object') {
				return value;
			}
			let p = proxies.get(value);
			if (!p) {
				p = new Proxy(value, {
					get: (target, property) => {
						this.#version;
						return proxy(Reflect.get(target, property));
					},
					set: (target, property, newValue) => {
						this.#version += 1;
						Reflect.set(target, property, newValue);
						this.#serialize(root);
						return true;
					}
				});
				proxies.set(value, p);
			}
			return p;
		};
		return proxy(root) as T;
	}

	set current(newValue: T) {
		this.#serialize(newValue);
		this.#version += 1;
	}

	#handleStorageEvent = (event: StorageEvent): void => {
		if (event.key !== this.#key || event.newValue === null) return;
		this.#current = this.#deserialize(event.newValue) ?? this.#current;
		this.#version += 1;
	};

	#deserialize(value: string | null): T | undefined {
		if (value === null) return undefined;
		try {
			return this.#serializer.deserialize(value);
		} catch (error) {
			console.error(`Error when parsing "${value}" from persisted store "${this.#key}"`, error);
			return undefined;
		}
	}

	#serialize(value: T): void {
		try {
			if (value != undefined) {
				this.#storage?.setItem(this.#key, this.#serializer.serialize(value));
			}
		} catch (error) {
			console.error(
				`Error when writing value from persisted store "${this.#key}" to ${this.#storage}`,
				error
			);
		}
	}
}
