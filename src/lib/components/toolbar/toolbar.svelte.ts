import { createContext } from 'svelte';
import { type ReadableBox, type ReadableBoxedValues, type WritableBox, attachRef, boxWith } from '../../internal/tools/index.js';
import { createBitsAttrs, boolToEmptyStrOrUndef, boolToTrueOrUndef } from '../../internal/attrs.js';
import type { Orientation } from '../../internal/index.js';
import type { BitsKeyboardEvent, RefAttachment, WithRefOpts } from '../../internal/types.js';
import { RovingFocusGroup } from '../../internal/roving-focus-group.js';
import { RovingFocusItem } from '../../internal/roving-focus-item.svelte.js';
import { type SelectionGroup, type SelectionType, SelectionValue, setSelectionGroup } from '../../internal/selection.svelte.js';

export const toolbarAttrs = createBitsAttrs({
	component: 'toolbar',
	parts: ['root', 'item', 'group', 'group-item', 'link', 'button'],
});

const [getToolbarRoot, setToolbarRoot] = createContext<ToolbarRootState>();

interface ToolbarRootStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			orientation: Orientation;
			loop: boolean;
		}> {}

export class ToolbarRootState {
	static create(opts: ToolbarRootStateOpts) {
		return setToolbarRoot(new ToolbarRootState(opts));
	}
	readonly opts: ToolbarRootStateOpts;
	readonly rovingFocusGroup: RovingFocusGroup;
	readonly attachment: RefAttachment;

	constructor(opts: ToolbarRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);

		this.rovingFocusGroup = new RovingFocusGroup({
			orientation: this.opts.orientation,
			loop: this.opts.loop,
			rootNode: this.opts.ref,
			candidateAttr: toolbarAttrs.item,
		});
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: 'toolbar',
				'data-orientation': this.opts.orientation.current,
				[toolbarAttrs.root]: '',
				...this.attachment,
			}) as const,
	);
}

interface ToolbarGroupStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
		}> {
	type: SelectionType;
	value: WritableBox<string | string[]>;
}

export class ToolbarGroupState implements SelectionGroup {
	static create(opts: ToolbarGroupStateOpts) {
		const group = new ToolbarGroupState(opts, getToolbarRoot());
		setSelectionGroup(group);
		return group;
	}
	readonly opts: ToolbarGroupStateOpts;
	readonly root: ToolbarRootState;
	readonly selection: SelectionValue;
	readonly disabled: ReadableBox<boolean>;
	readonly orientation: ReadableBox<Orientation>;
	readonly rovingFocus = boxWith(() => true);
	readonly rovingFocusGroup: RovingFocusGroup;
	readonly itemAttrs = { [toolbarAttrs.item]: '', [toolbarAttrs['group-item']]: '' } as const;
	readonly attachment: RefAttachment;

	constructor(opts: ToolbarGroupStateOpts, root: ToolbarRootState) {
		this.opts = opts;
		this.root = root;
		this.selection = new SelectionValue(opts.type, opts.value);
		this.disabled = opts.disabled;
		this.orientation = root.opts.orientation;
		this.rovingFocusGroup = root.rovingFocusGroup;
		this.attachment = attachRef(this.opts.ref);
	}

	// The toolbar's tab stop belongs to the whole toolbar, so selecting an item leaves it put.
	toggleItem(item: string) {
		this.selection.toggle(item);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[toolbarAttrs.group]: '',
				role: 'group',
				'data-orientation': this.root.opts.orientation.current,
				'data-disabled': boolToEmptyStrOrUndef(this.opts.disabled.current),
				...this.attachment,
			}) as const,
	);
}

interface ToolbarLinkStateOpts extends WithRefOpts {}

export class ToolbarLinkState {
	static create(opts: ToolbarLinkStateOpts) {
		return new ToolbarLinkState(opts, getToolbarRoot());
	}
	readonly opts: ToolbarLinkStateOpts;
	readonly root: ToolbarRootState;
	readonly rovingItem: RovingFocusItem;

	constructor(opts: ToolbarLinkStateOpts, root: ToolbarRootState) {
		this.opts = opts;
		this.root = root;
		this.rovingItem = new RovingFocusItem({
			group: this.root.rovingFocusGroup,
			ref: this.opts.ref,
		});

		this.onkeydown = this.onkeydown.bind(this);
	}

	onkeydown(e: BitsKeyboardEvent) {
		this.rovingItem.handleKeydown(e);
	}

	readonly #role = $derived.by(() => {
		if (!this.opts.ref.current) return undefined;
		const tagName = this.opts.ref.current.tagName;
		if (tagName !== 'A') return 'link' as const;
		return undefined;
	});

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[toolbarAttrs.link]: '',
				[toolbarAttrs.item]: '',
				role: this.#role,
				'data-orientation': this.root.opts.orientation.current,
				//
				onkeydown: this.onkeydown,
				...this.rovingItem.props,
			}) as const,
	);
}

interface ToolbarButtonStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
		}> {}

export class ToolbarButtonState {
	static create(opts: ToolbarButtonStateOpts) {
		return new ToolbarButtonState(opts, getToolbarRoot());
	}
	readonly opts: ToolbarButtonStateOpts;
	readonly root: ToolbarRootState;
	readonly rovingItem: RovingFocusItem;

	constructor(opts: ToolbarButtonStateOpts, root: ToolbarRootState) {
		this.opts = opts;
		this.root = root;
		this.rovingItem = new RovingFocusItem({
			group: this.root.rovingFocusGroup,
			ref: this.opts.ref,
		});

		this.onkeydown = this.onkeydown.bind(this);
	}

	onkeydown(e: BitsKeyboardEvent) {
		this.rovingItem.handleKeydown(e);
	}

	readonly #role = $derived.by(() => {
		if (!this.opts.ref.current) return undefined;
		const tagName = this.opts.ref.current.tagName;
		if (tagName !== 'BUTTON') return 'button' as const;
		return undefined;
	});

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[toolbarAttrs.item]: '',
				[toolbarAttrs.button]: '',
				role: this.#role,
				'data-disabled': boolToEmptyStrOrUndef(this.opts.disabled.current),
				'data-orientation': this.root.opts.orientation.current,
				disabled: boolToTrueOrUndef(this.opts.disabled.current),
				//
				onkeydown: this.onkeydown,
				...this.rovingItem.props,
			}) as const,
	);
}
