// Light/dark/system theme. Replaces the vendored mode-watcher engine.
//
// `ThemeState` holds the reactive preference (`pref`: `'light' | 'dark'`, or `null` to
// follow the OS) and the resolved mode shown (`current`). "System" is the absence of a
// stored value — it is never persisted, just resolved from the OS at read time.
// It is created once per app via `initTheme()` in a root layout and
// shared through context with `getTheme()` — so its constructor runs in a component
// context, where the apply/persist/sync `$effect`s are legal (no `$effect.root`) and
// are torn down with the layout. Pre-paint application that prevents FOUC lives in
// each app's `app.html` <head>. The `.dark` class drives `color-scheme` via CSS; the
// inline `style.colorScheme` only keeps that override consistent with the FOUC script
// (inline beats the CSS rule).
import { MediaQuery } from 'svelte/reactivity';
import { on } from 'svelte/events';
import { createContext } from 'svelte';
import { BROWSER } from 'esm-env';

export type Mode = 'light' | 'dark';

const KEY = 'mode';

const isMode = (value: unknown): value is Mode => value === 'light' || value === 'dark';

function readStored(): Mode | null {
	if (!BROWSER) return null;
	const saved = localStorage.getItem(KEY);
	return isMode(saved) ? saved : null;
}

export class ThemeState {
	/** Explicit choice, or `null` to follow the OS ("system"). A "system" token is never stored. */
	pref = $state<Mode | null>(readStored());
	// matchMedia touches `window`, so only construct in the browser.
	#system = BROWSER ? new MediaQuery('prefers-color-scheme: dark') : null;

	constructor() {
		if (!BROWSER) return;

		// Apply the resolved mode to <html>; first paint is handled by app.html.
		$effect(() => {
			const dark = this.current === 'dark';
			const el = document.documentElement;
			el.classList.toggle('dark', dark);
			el.style.colorScheme = dark ? 'dark' : 'light';
		});

		// Persist an explicit choice; following the OS is the absence of a stored value.
		$effect(() => {
			if (this.pref) localStorage.setItem(KEY, this.pref);
			else localStorage.removeItem(KEY);
		});

		// Adopt changes from other tabs (a new choice, or cleared back to "system").
		$effect(() =>
			on(window, 'storage', (e) => {
				if (e.key === KEY) this.pref = isMode(e.newValue) ? e.newValue : null;
			}),
		);
	}

	/**
	 * The resolved mode actually shown: `'light' | 'dark'`, or `undefined` during SSR.
	 * Follows the OS when `pref` is `null`.
	 */
	get current(): Mode | undefined {
		if (!BROWSER) return undefined;
		return this.pref ?? (this.#system!.current ? 'dark' : 'light');
	}

	toggle(): void {
		this.pref = this.current === 'dark' ? 'light' : 'dark';
	}
}

const [getTheme, setTheme] = createContext<ThemeState>();

/** Create and provide the theme. Call once in a root layout's `<script>`. */
export const initTheme = (): ThemeState => setTheme(new ThemeState());

/** Read the theme provided by `initTheme()`. Call during init of any descendant. */
export { getTheme };
