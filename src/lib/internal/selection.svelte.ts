import type { ReadableBox, ReadableBoxedValues, WritableBox } from './tools/index.js';
import { boolToStr, boolToEmptyStrOrUndef, boolToTrueOrUndef, getAriaChecked } from './attrs.js';
import { kbd } from './kbd.js';
import type { Orientation } from './index.js';
import type { BitsKeyboardEvent, BitsMouseEvent, WithRefOpts } from './types.js';
import type { RovingFocusGroup } from './roving-focus-group.js';
import { RovingFocusItem } from './roving-focus-item.svelte.js';

export type SelectionType = 'single' | 'multiple';

export const emptySelection = (type: SelectionType): string | string[] => (type === 'single' ? '' : []);

/**
 * Membership over a bindable that is a string in single mode and a string array in multiple
 * mode. The mode is fixed at construction, so a write always keeps the shape the consumer's
 * prop was declared with.
 */
export class SelectionValue {
	readonly isMulti: boolean;
	readonly #value: WritableBox<string | string[]>;

	constructor(type: SelectionType, value: WritableBox<string | string[]>) {
		this.isMulti = type === 'multiple';
		this.#value = value;
	}

	includes(item: string): boolean {
		const value = this.#value.current;
		return this.isMulti ? (value as string[]).includes(item) : value === item;
	}

	/** Flips membership and returns whether the item is selected afterwards. */
	toggle(item: string): boolean {
		const selected = !this.includes(item);
		if (this.isMulti) {
			const value = this.#value.current as string[];
			this.#value.current = selected ? [...value, item] : value.filter((v) => v !== item);
		} else {
			this.#value.current = selected ? item : '';
		}
		return selected;
	}
}

/** What a selection item needs from the group that owns it. */
export interface SelectionGroup {
	readonly selection: SelectionValue;
	readonly disabled: ReadableBox<boolean>;
	readonly orientation: ReadableBox<Orientation>;
	readonly rovingFocusGroup: RovingFocusGroup;
	/** Whether arrow keys move between the items; absent means always. */
	readonly rovingFocus?: ReadableBox<boolean>;
	/** A selection takes the roving tab stop in a toggle group; a toolbar's stays where it is. */
	readonly selectionTakesTabStop: boolean;
	/** Beyond the roving group's candidate attribute, which every item carries. */
	readonly extraItemAttrs?: Record<string, ''>;
}

export interface SelectionItemOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			value: string;
			disabled: boolean;
		}> {}

export class SelectionItemState {
	readonly opts: SelectionItemOpts;
	readonly group: SelectionGroup;
	readonly rovingItem: RovingFocusItem;
	readonly #isDisabled = $derived.by(() => this.opts.disabled.current || this.group.disabled.current);
	readonly isPressed = $derived.by(() => this.group.selection.includes(this.opts.value.current));

	constructor(opts: SelectionItemOpts, group: SelectionGroup) {
		this.opts = opts;
		this.group = group;
		this.rovingItem = new RovingFocusItem({
			group: group.rovingFocusGroup,
			ref: opts.ref,
			enabled: group.rovingFocus,
		});

		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	#activate() {
		if (this.#isDisabled) return;
		const selected = this.group.selection.toggle(this.opts.value.current);
		if (selected && this.group.selectionTakesTabStop) this.group.rovingFocusGroup.setCurrentTabStopId(this.opts.id.current);
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
				id: this.opts.id.current,
				role: this.group.selection.isMulti ? undefined : 'radio',
				'data-orientation': this.group.orientation.current,
				'data-disabled': boolToEmptyStrOrUndef(this.#isDisabled),
				'data-state': this.isPressed ? 'on' : 'off',
				'data-value': this.opts.value.current,
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
