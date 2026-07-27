/**
 * An overlay's open-state cell: pure signals, no effects. LIBRARY-INTERNAL — the
 * class is deliberately absent from the package exports (state-flow hard rule:
 * consumers never construct or hold library state; apps drive overlays via the
 * `open` source prop and reconcile via onOpenChangeComplete). Roots construct it,
 * and library blocks/wrappers (AlertModal, menubar-menu) may hand one to a root
 * via its `state` prop. Reading and writing `open` is the whole API: the overlay's
 * trigger/close/dismiss machinery and any markup, deriveds, or effects are all
 * dependents of the same signal — there is no change callback and nothing to wire.
 *
 * An optional `source` makes `open` a writable derived: it re-derives whenever
 * the source changes (a route param, `editing !== null`, an external machine's
 * open), and direct writes — Escape, a Close button, `cell.open = false` —
 * override it until the next source change.
 *
 * An optional `write` makes the cell delegate instead of own: direct writes
 * are forwarded to it and the source stays authoritative, so an external
 * machine (e.g. the alertModal store) hears a self-close the moment it
 * happens rather than reconciling after the animation. Without it the cell
 * owns the override — own-or-delegate.
 */
export class OpenCell {
	readonly #source?: () => boolean;
	readonly #write?: (open: boolean) => void;
	#open: boolean = $derived.by(() => this.#source?.() ?? false);

	constructor(source?: () => boolean, write?: (open: boolean) => void) {
		this.#source = source;
		this.#write = write;
	}

	get open(): boolean {
		return this.#open;
	}

	set open(next: boolean) {
		if (next === this.#open) return;
		if (this.#write) this.#write(next);
		else this.#open = next;
	}
}
