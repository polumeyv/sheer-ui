import { boxWith, type WritableBox } from '../../tools/index.js';
import { untrack } from 'svelte';

export type RangeEndpoints<T> = { start: T | undefined; end: T | undefined };

export class RangeFieldValueController<T> {
	readonly value: WritableBox<RangeEndpoints<T>>;
	readonly placeholder: WritableBox<T>;
	start = $derived.by(() => this.value.current.start);
	end = $derived.by(() => this.value.current.end);
	readonly startComplete = $derived(this.start !== undefined);
	readonly endComplete = $derived(this.end !== undefined);
	readonly complete = $derived(this.startComplete && this.endComplete);

	constructor(value: WritableBox<RangeEndpoints<T>>, placeholder: WritableBox<T>) {
		this.value = value;
		this.placeholder = placeholder;
		$effect(() => {
			const start = this.value.current.start;
			untrack(() => {
				if (start && this.placeholder.current !== start) this.placeholder.current = start;
			});
		});
	}

	sideValueBox(side: 'start' | 'end') {
		return boxWith(
			() => (side === 'start' ? this.start : this.end),
			(next: T | undefined) => {
				if (side === 'start') this.start = next;
				else this.end = next;
				this.#commit();
			},
		);
	}

	#commit() {
		const value = this.value.current;
		if (this.start !== undefined && this.end !== undefined) {
			if (value.start !== this.start || value.end !== this.end) this.value.current = { start: this.start, end: this.end };
		} else if (value.start !== undefined && value.end !== undefined) {
			this.value.current = { start: undefined, end: undefined };
		}
	}
}
