/** Copy text to the clipboard with a temporary copied state. */
export class UseClipboard {
	/** The result of the last copy — `"success"`, `"failure"`, or `undefined` if idle. */
	status = $state<'success' | 'failure' | undefined>(undefined);
	/** The last successfully copied text. */
	lastCopied = $state<string | undefined>(undefined);
	/** Whether the last copy was successful. */
	copied = $derived(this.status === 'success');

	/** Time in ms before the copied status resets. */
	delay: number;
	timeout: ReturnType<typeof setTimeout> | undefined = undefined;

	constructor(delay?: number) {
		this.delay = delay ?? 2000;
	}

	/** Copies the given text to the user's clipboard. */
	copy(text: string | number): void {
		this.timeout && (clearTimeout(this.timeout), (this.status = undefined));

		navigator.clipboard
			.writeText(text.toString())
			.then(
				() => ((this.status = 'success'), (this.lastCopied = text.toString())),
				() => (this.status = 'failure'),
			)
			.then(
				() => (this.timeout = setTimeout(() => (this.status = undefined), this.delay)),
				() => (this.status = 'failure'),
			);
	}
}
