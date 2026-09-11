import { boolToStr, boolToEmptyStrOrUndef, boolToTrueOrUndef, getAriaChecked } from './attrs.js';
import { kbd } from './kbd.js';
import type { Orientation } from './index.js';
import type { BitsKeyboardEvent, BitsMouseEvent } from './types.js';
import type { RovingFocusGroup } from './roving-focus-group.svelte.js';
import { RovingFocusItem } from './roving-focus-item.svelte.js';

export type SelectionType = 'single' | 'multiple';

export type Selection = string | string[];

export const emptySelection = (type: SelectionType): Selection => (type === 'single' ? '' : []);

/**
 * Membership over a consumer's bindable that is a string in single mode and a string array
 * in multiple mode. `value` reads and writes the root's prop through the closures it was
 * built with; the mode is fixed at construction, so `with` always keeps the declared shape.
 */
export class SelectionValue {
	readonly isMulti: boolean;
	readonly #read: () => Selection;
	readonly #write: (value: Selection) => void;

	constructor(type: SelectionType, read: () => Selection, write: (value: Selection) => void) {
		this.isMulti = type === 'multiple';
		this.#read = read;
		this.#write = write;
	}

	get value(): Selection {
		return this.#read();
	}

	set value(next: Selection) {
		this.#write(next);
	}

	includes(item: string): boolean {
		const value = this.#read();
		return this.isMulti ? (value as string[]).includes(item) : value === item;
	}

	/** The value with `item` present or absent; the same reference when it already is. */
	with(item: string, selected: boolean): Selection {
		const value = this.#read();
		const present = this.isMulti ? (value as string[]).includes(item) : value === item;
		if (present === selected) return value;
		if (!this.isMulti) return selected ? item : '';
		return selected ? [...(value as string[]), item] : (value as string[]).filter((v) => v !== item);
	}
}

/**
 * What a selection item needs from the group that owns it. Reactive members are accessors on the
 * implementing class, read at use, never copied out.
 */
export interface SelectionGroup {
	readonly selection: SelectionValue;
	readonly disabled: boolean;
	readonly orientation: Orientation;
	readonly rovingFocusGroup: RovingFocusGroup;
	/** Whether arrow keys move between the items; absent means always. */
	readonly rovingFocus?: boolean;
	/** A selection takes the roving tab stop in a toggle group; a toolbar's stays where it is. */
	readonly selectionTakesTabStop: boolean;
	/** Beyond the roving group's candidate attribute, which every item carries. */
	readonly extraItemAttrs?: Record<string, ''>;
}

/** The item component's props as accessors over its `$props()`; `ref` writes back to its bindable. */
export interface SelectionItemOpts {
	readonly id: string;
	readonly value: string;
	readonly disabled: boolean;
	ref: HTMLElement | null;
}

export class SelectionItemState {
	readonly opts: SelectionItemOpts;
	readonly group: SelectionGroup;
	readonly rovingItem: RovingFocusItem;
	readonly #isDisabled = $derived.by(() => this.opts.disabled || this.group.disabled);
	readonly isPressed = $derived.by(() => this.group.selection.includes(this.opts.value));

	constructor(opts: SelectionItemOpts, group: SelectionGroup) {
		this.opts = opts;
		this.group = group;
		this.rovingItem = new RovingFocusItem({
			group: group.rovingFocusGroup,
			ref: () => opts.ref,
			setRef: (v) => (opts.ref = v),
			enabled: () => group.rovingFocus ?? true,
		});

		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	#activate() {
		if (this.#isDisabled) return;
		const item = this.opts.value;
		const selected = !this.group.selection.includes(item);
		this.group.selection.value = this.group.selection.with(item, selected);
		if (selected && this.group.selectionTakesTabStop) this.group.rovingFocusGroup.setCurrentTabStopId(this.opts.id);
	}

	onclick(_: BitsMouseEvent) {
		this.#activate();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.#isDisabled) return;
		if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
			e.preventDefault();
			this.#activate();
			return;
		}
		this.rovingItem.handleKeydown(e);
	}

	readonly snippetProps = $derived.by(() => ({ pressed: this.isPressed }));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id,
				role: this.group.selection.isMulti ? undefined : 'radio',
				'data-orientation': this.group.orientation,
				'data-disabled': boolToEmptyStrOrUndef(this.#isDisabled),
				'data-state': this.isPressed ? 'on' : 'off',
				'data-value': this.opts.value,
				'aria-pressed': this.group.selection.isMulti ? boolToStr(this.isPressed) : undefined,
				'aria-checked': this.group.selection.isMulti ? undefined : getAriaChecked(this.isPressed, false),
				disabled: boolToTrueOrUndef(this.#isDisabled),
				...this.group.rovingFocusGroup.candidateAttrs,
				...this.group.extraItemAttrs,
				//
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				...this.rovingItem.props,
			}) as const,
	);
}
