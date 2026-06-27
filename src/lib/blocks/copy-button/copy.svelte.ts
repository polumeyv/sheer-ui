/** Copy text to the clipboard with a temporary copied state. */
export class UseClipboard {
    /** The result of the last copy — `true` if it succeeded, `false` if it failed, `undefined` if idle. */
    status = $state<boolean>();
    delay: number;
    reset: boolean;
    timeout: ReturnType<typeof setTimeout> | undefined = undefined;
    /** The last successfully copied text. */
    lastCopied = $state<string | undefined>(undefined);

    constructor({
        delay = 2000,
        reset = true,
    }: {
        /** Time in ms before the copied status resets. */
        delay?: number;
        /** Whether to auto-reset the status after the delay. */
        reset?: boolean;
    } = {}) {
        this.delay = delay;
        this.reset = reset;
    }

    /** Copies the given text to the user's clipboard. */
    copy(text: string | number): void {
        this.timeout && (clearTimeout(this.timeout), (this.status = undefined));

        navigator.clipboard.writeText(text.toString()).then(
            () => ((this.status = true), (this.lastCopied = text.toString())),
            () => (this.status = false)
        ).then(
            () => (this.timeout = setTimeout(() => (this.status = undefined), this.delay)),
            () => (this.status = false)
        );
    }
}