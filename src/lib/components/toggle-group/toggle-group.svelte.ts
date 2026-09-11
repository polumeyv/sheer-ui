import { createContext } from 'svelte';
import { type ReadableBox, type ReadableBoxedValues, attachRef } from '../../internal/tools/index.js';
import { createBitsAttrs, boolToEmptyStrOrUndef } from '../../internal/attrs.js';
import type { Orientation } from '../../internal/index.js';
import type { RefAttachment, WithRefOpts } from '../../internal/types.js';
import { RovingFocusGroup } from '../../internal/roving-focus-group.svelte.js';
import { type SelectionGroup, type SelectionItemOpts, SelectionItemState, SelectionValue } from '../../internal/selection.svelte.js';

export const toggleGroupAttrs = createBitsAttrs({
	component: 'toggle-group',
	parts: ['root', 'item'],
});

const [getToggleGroupRoot, setToggleGroupRoot] = createContext<ToggleGroupRootState>();

interface ToggleGroupRootStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
			rovingFocus: boolean;
			loop: boolean;
			orientation: Orientation;
		}> {
	selection: SelectionValue;
}

export class ToggleGroupRootState implements SelectionGroup {
	static create(opts: ToggleGroupRootStateOpts) {
		return setToggleGroupRoot(new ToggleGroupRootState(opts));
	}
	readonly opts: ToggleGroupRootStateOpts;
	readonly selection: SelectionValue;
	readonly disabled: ReadableBox<boolean>;
	readonly orientation: ReadableBox<Orientation>;
	readonly rovingFocus: ReadableBox<boolean>;
	readonly rovingFocusGroup: RovingFocusGroup;
	readonly selectionTakesTabStop = true;
	readonly attachment: RefAttachment;

	constructor(opts: ToggleGroupRootStateOpts) {
		this.opts = opts;
		this.selection = opts.selection;
		this.disabled = opts.disabled;
		this.orientation = opts.orientation;
		this.rovingFocus = opts.rovingFocus;
		this.attachment = attachRef(opts.ref);
		this.rovingFocusGroup = new RovingFocusGroup({
			candidateAttr: toggleGroupAttrs.item,
			rootNode: opts.ref,
			loop: opts.loop,
			orientation: opts.orientation,
		});
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[toggleGroupAttrs.root]: '',
				role: 'group',
				'data-orientation': this.opts.orientation.current,
				'data-disabled': boolToEmptyStrOrUndef(this.opts.disabled.current),
				...this.attachment,
			}) as const,
	);
}

export function createToggleGroupItem(opts: SelectionItemOpts) {
	return new SelectionItemState(opts, getToggleGroupRoot());
}
