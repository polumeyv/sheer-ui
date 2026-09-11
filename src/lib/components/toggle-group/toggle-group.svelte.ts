import { createContext } from 'svelte';
import { attachRef, boxWith } from '../../internal/tools/index.js';
import { createBitsAttrs, boolToEmptyStrOrUndef } from '../../internal/attrs.js';
import type { Orientation } from '../../internal/index.js';
import type { RefAttachment } from '../../internal/types.js';
import { RovingFocusGroup } from '../../internal/roving-focus-group.svelte.js';
import { type SelectionGroup, type SelectionItemOpts, SelectionItemState, SelectionValue } from '../../internal/selection.svelte.js';

export const toggleGroupAttrs = createBitsAttrs({
	component: 'toggle-group',
	parts: ['root', 'item'],
});

const [getToggleGroupRoot, setToggleGroupRoot] = createContext<ToggleGroupRootState>();

/** The root component's props as accessors over its `$props()`; `ref` writes back to its bindable. */
interface ToggleGroupRootStateOpts {
	readonly id: string;
	readonly disabled: boolean;
	readonly rovingFocus: boolean;
	readonly loop: boolean;
	readonly orientation: Orientation;
	ref: HTMLElement | null;
	selection: SelectionValue;
}

export class ToggleGroupRootState implements SelectionGroup {
	static create(opts: ToggleGroupRootStateOpts) {
		return setToggleGroupRoot(new ToggleGroupRootState(opts));
	}
	readonly opts: ToggleGroupRootStateOpts;
	readonly selection: SelectionValue;
	readonly rovingFocusGroup: RovingFocusGroup;
	readonly selectionTakesTabStop = true;
	readonly attachment: RefAttachment;

	constructor(opts: ToggleGroupRootStateOpts) {
		this.opts = opts;
		this.selection = opts.selection;
		this.attachment = attachRef<HTMLElement>((v) => (opts.ref = v));
		this.rovingFocusGroup = new RovingFocusGroup({
			candidateAttr: toggleGroupAttrs.item,
			rootNode: boxWith(() => opts.ref),
			loop: boxWith(() => opts.loop),
			orientation: boxWith(() => opts.orientation),
		});
	}

	get disabled() {
		return this.opts.disabled;
	}

	get orientation() {
		return this.opts.orientation;
	}

	get rovingFocus() {
		return this.opts.rovingFocus;
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id,
				[toggleGroupAttrs.root]: '',
				role: 'group',
				'data-orientation': this.opts.orientation,
				'data-disabled': boolToEmptyStrOrUndef(this.opts.disabled),
				...this.attachment,
			}) as const,
	);
}

export function createToggleGroupItem(opts: SelectionItemOpts) {
	return new SelectionItemState(opts, getToggleGroupRoot());
}
