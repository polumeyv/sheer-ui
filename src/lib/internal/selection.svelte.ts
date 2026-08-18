import { createContext } from 'svelte';
import type { ReadableBox, ReadableBoxedValues, WritableBox } from './tools/index.js';
import { boolToStr, boolToEmptyStrOrUndef, boolToTrueOrUndef, getAriaChecked, getToggleDataState } from './attrs.js';
import { kbd } from './kbd.js';
import type { Orientation } from './index.js';
import type { BitsKeyboardEvent, BitsMouseEvent, WithRefOpts } from './types.js';
import type { RovingFocusGroup } from './roving-focus-group.js';
import { RovingFocusItem } from './roving-focus-item.svelte.js';

export type SelectionType = 'single' | 'multiple';

export const emptySelection = (type: SelectionType): string | string[] => type === 'single' ? '' : [];

/**
 * Set membership over a bindable value that is a string in single mode and a
 * string array in multiple mode. Mode is fixed at construction, so a write
 * always keeps the shape the consumer's prop was declared with.
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

/** Everything a selection item needs from the group that owns it. */
export interface SelectionGroup {
	readonly selection: SelectionValue;
	readonly disabled: ReadableBox<boolean>;
	readonly orientation: ReadableBox<Orientation>;
	readonly rovingFocusGroup: RovingFocusGroup;
	readonly rovingFocus: ReadableBox<boolean>;
	readonly itemAttrs: Record<string, ''>;
	toggleItem(item: string, id: string): void;
}

const [getSelectionGroup, setSelectionGroup] = createContext<SelectionGroup>();

export { setSelectionGroup };

interface SelectionItemOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			value: string;
			disabled: boolean;
		}> {}

export class SelectionItemState {
	static create(opts: SelectionItemOpts) {
		return new SelectionItemState(opts, getSelectionGroup());
	}
	readonly opts: SelectionItemOpts;
	readonly group: SelectionGroup;
	readonly rovingItem: RovingFocusItem;
	readonly #isDisabled = $derived.by(() => this.opts.disabled.current || this.group.disabled.current);
	readonly isPressed = $derived.by(() => this.group.selection.includes(this.opts.value.current));

	constructor(opts: SelectionItemOpts, group: SelectionGroup) {
		this.opts = opts;
		this.group = group;
		this.rovingItem = new RovingFocusItem({
			group: this.group.rovingFocusGroup,
			ref: this.opts.ref,
			enabled: this.group.rovingFocus,
		});

		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	#activate() {
		if (this.#isDisabled) return;
		this.group.toggleItem(this.opts.value.current, this.opts.id.current);
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

	readonly snippetProps = $derived.by(() => ({
		pressed: this.isPressed,
	}));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: this.group.selection.isMulti ? undefined : 'radio',
				'data-orientation': this.group.orientation.current,
				'data-disabled': boolToEmptyStrOrUndef(this.#isDisabled),
				'data-state': getToggleDataState(this.isPressed),
				'data-value': this.opts.value.current,
				'aria-pressed': this.group.selection.isMulti ? boolToStr(this.isPressed) : undefined,
				'aria-checked': this.group.selection.isMulti ? undefined : getAriaChecked(this.isPressed, false),
				disabled: boolToTrueOrUndef(this.#isDisabled),
				...this.group.itemAttrs,
				//
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				...this.rovingItem.props,
			}) as const,
	);
}
