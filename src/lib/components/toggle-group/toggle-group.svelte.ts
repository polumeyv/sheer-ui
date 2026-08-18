import { type ReadableBox, type ReadableBoxedValues, type WritableBox, attachRef } from '../../internal/tools/index.js';
import { createBitsAttrs, boolToEmptyStrOrUndef } from '../../internal/attrs.js';
import type { Orientation } from '../../internal/index.js';
import type { RefAttachment, WithRefOpts } from '../../internal/types.js';
import { RovingFocusGroup } from '../../internal/roving-focus-group.js';
import { type SelectionGroup, type SelectionType, SelectionValue, setSelectionGroup } from '../../internal/selection.svelte.js';

export const toggleGroupAttrs = createBitsAttrs({
	component: 'toggle-group',
	parts: ['root', 'item'],
});

interface ToggleGroupRootStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
			rovingFocus: boolean;
			loop: boolean;
			orientation: Orientation;
		}> {
	type: SelectionType;
	value: WritableBox<string | string[]>;
}

export class ToggleGroupRootState implements SelectionGroup {
	static create(opts: ToggleGroupRootStateOpts) {
		const root = new ToggleGroupRootState(opts);
		setSelectionGroup(root);
		return root;
	}
	readonly opts: ToggleGroupRootStateOpts;
	readonly selection: SelectionValue;
	readonly disabled: ReadableBox<boolean>;
	readonly orientation: ReadableBox<Orientation>;
	readonly rovingFocus: ReadableBox<boolean>;
	readonly rovingFocusGroup: RovingFocusGroup;
	readonly itemAttrs = { [toggleGroupAttrs.item]: '' } as const;
	readonly attachment: RefAttachment;

	constructor(opts: ToggleGroupRootStateOpts) {
		this.opts = opts;
		this.selection = new SelectionValue(opts.type, opts.value);
		this.disabled = opts.disabled;
		this.orientation = opts.orientation;
		this.rovingFocus = opts.rovingFocus;
		this.attachment = attachRef(this.opts.ref);
		this.rovingFocusGroup = new RovingFocusGroup({
			candidateAttr: toggleGroupAttrs.item,
			rootNode: opts.ref,
			loop: opts.loop,
			orientation: opts.orientation,
		});
	}

	// Selecting hands the tab stop to the item; toolbar's group deliberately leaves it put.
	toggleItem(item: string, id: string) {
		if (this.selection.toggle(item)) this.rovingFocusGroup.setCurrentTabStopId(id);
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
