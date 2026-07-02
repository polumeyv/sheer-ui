/** Copy text to the clipboard with a temporary copied/failed feedback window. */
export class UseClipboard {
	#status = $state<'idle' | 'copied' | 'failed'>('idle');
	#lastCopied = $state<string>();
	#timeout: ReturnType<typeof setTimeout> | undefined;
	/** Each copy takes a ticket; a late resolution or stale reset timer checks it before touching state. */
	#ticket = 0;

	/** Time in ms the copied/failed status holds before returning to idle. */
	delay: number;

	constructor(delay = 2000) {
		this.delay = delay;
	}

	/** `'idle'` until a copy settles, then `'copied'` or `'failed'` for {@link delay} ms. */
	get status() {
		return this.#status;
	}

	/** Whether the copied feedback window is active. */
	get copied() {
		return this.#status === 'copied';
	}

	/** The last successfully copied text. */
	get lastCopied() {
		return this.#lastCopied;
	}

	/** Copies the given text to the user's clipboard. Resolves `true` on success. */
	async copy(text: string | number): Promise<boolean> {
		const ticket = ++this.#ticket;
		clearTimeout(this.#timeout);
		this.#status = 'idle';

		let ok = true;
		try {
			await navigator.clipboard.writeText(text.toString());
		} catch {
			ok = false;
		}

		// A newer copy started while this one was in flight — it owns the feedback window.
		if (ticket !== this.#ticket) return ok;

		if (ok) this.#lastCopied = text.toString();
		this.#status = ok ? 'copied' : 'failed';
		this.#timeout = setTimeout(() => ticket === this.#ticket && (this.#status = 'idle'), this.delay);
		return ok;
	}
}
