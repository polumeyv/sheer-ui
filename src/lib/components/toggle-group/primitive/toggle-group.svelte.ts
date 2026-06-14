import { createContext } from 'svelte';
import { attachRef, type RefAttachment } from '$lib/vendor/attach-ref';
import { createBitsAttrs } from '$lib/vendor/attrs';
import { kbd } from '$lib/vendor/kbd';
import type { Orientation } from '$lib/shared/index';
import type { ReadableProps, WithRefProps, WritableProp, WritableProps } from '$lib/vendor';
import type { BitsKeyboardEvent, BitsMouseEvent } from '$lib/vendor/types';
import { RovingFocusGroup } from '$lib/vendor/roving-focus-group';

export const toggleGroupAttrs = createBitsAttrs({
	component: 'toggle-group',
	parts: ['root', 'item'],
});

const [getToggleGroupRootContext, setToggleGroupRootContext] = createContext<ToggleGroup>();

interface ToggleGroupBaseStateOpts
	extends
		WithRefProps,
		ReadableProps<{
			disabled: boolean;
			rovingFocus: boolean;
			loop: boolean;
			orientation: Orientation;
		}> {}

abstract class ToggleGroupBaseState {
	readonly opts: ToggleGroupBaseStateOpts;
	readonly rovingFocusGroup: RovingFocusGroup;
	readonly attachment: RefAttachment;

	constructor(opts: ToggleGroupBaseStateOpts) {
		this.opts = opts;
		this.attachment = attachRef<HTMLElement>((v) => (this.opts.ref.current = v));
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
				'data-disabled': this.opts.disabled.current ? '' : undefined,
				...this.attachment,
			}) as const,
	);
}

interface ToggleGroupSingleStateOpts
	extends
		ToggleGroupBaseStateOpts,
		WritableProps<{
			value: string;
		}> {}

class ToggleGroupSingleState extends ToggleGroupBaseState {
	override readonly opts: ToggleGroupSingleStateOpts;
	isMulti = false;
	readonly anyPressed = $derived.by(() => this.opts.value.current !== '');

	constructor(opts: ToggleGroupSingleStateOpts) {
		super(opts);
		this.opts = opts;
	}

	includesItem(item: string) {
		return this.opts.value.current === item;
	}

	toggleItem(item: string, id: string) {
		if (this.includesItem(item)) {
			this.opts.value.current = '';
		} else {
			this.opts.value.current = item;
			this.rovingFocusGroup.setCurrentTabStopId(id);
		}
	}
}

//
// MULTIPLE
//

interface ToggleGroupMultipleStateOpts
	extends
		ToggleGroupBaseStateOpts,
		WritableProps<{
			value: string[];
		}> {}

class ToggleGroupMultipleState extends ToggleGroupBaseState {
	override readonly opts: ToggleGroupMultipleStateOpts;
	isMulti = true;
	readonly anyPressed = $derived.by(() => this.opts.value.current.length > 0);

	constructor(opts: ToggleGroupMultipleStateOpts) {
		super(opts);

		this.opts = opts;
	}

	includesItem(item: string) {
		return this.opts.value.current.includes(item);
	}

	toggleItem(item: string, id: string) {
		if (this.includesItem(item)) {
			this.opts.value.current = this.opts.value.current.filter((v) => v !== item);
		} else {
			this.opts.value.current = [...this.opts.value.current, item];
			this.rovingFocusGroup.setCurrentTabStopId(id);
		}
	}
}

type ToggleGroup = ToggleGroupSingleState | ToggleGroupMultipleState;

interface ToggleGroupRootOpts
	extends
		WithRefProps,
		ReadableProps<{
			disabled: boolean;
			rovingFocus: boolean;
			loop: boolean;
			orientation: Orientation;
		}> {
	type: 'single' | 'multiple';
	value: WritableProp<string> | WritableProp<string[]>;
}

export class ToggleGroupRootState {
	static create(opts: ToggleGroupRootOpts): ToggleGroup {
		const { type, ...rest } = opts;
		const rootState =
			type === 'single'
				? new ToggleGroupSingleState(rest as ToggleGroupSingleStateOpts)
				: new ToggleGroupMultipleState(rest as ToggleGroupMultipleStateOpts);
		return setToggleGroupRootContext(rootState);
	}
}

interface ToggleGroupItemStateOpts
	extends
		WithRefProps,
		ReadableProps<{
			value: string;
			disabled: boolean;
		}> {}

export class ToggleGroupItemState {
	static create(opts: ToggleGroupItemStateOpts) {
		return new ToggleGroupItemState(opts, getToggleGroupRootContext());
	}
	readonly opts: ToggleGroupItemStateOpts;
	readonly root: ToggleGroup;
	readonly attachment: RefAttachment;
	readonly #isDisabled = $derived.by(() => this.opts.disabled.current || this.root.opts.disabled.current);
	readonly isPressed = $derived.by(() => this.root.includesItem(this.opts.value.current));

	readonly #ariaChecked = $derived.by(() => {
		return this.root.isMulti ? undefined : this.isPressed ? 'true' : 'false';
	});

	readonly #ariaPressed = $derived.by(() => {
		return this.root.isMulti ? (this.isPressed ? 'true' : 'false') : undefined;
	});

	constructor(opts: ToggleGroupItemStateOpts, root: ToggleGroup) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef<HTMLElement>((v) => (this.opts.ref.current = v));
		$effect(() => {
			if (!this.root.opts.rovingFocus.current) {
				this.#tabIndex = 0;
			} else {
				this.#tabIndex = this.root.rovingFocusGroup.getTabIndex(this.opts.ref.current);
			}
		});

		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	#toggleItem() {
		if (this.#isDisabled) return;
		this.root.toggleItem(this.opts.value.current, this.opts.id.current);
	}

	onclick(_: BitsMouseEvent) {
		if (this.#isDisabled) return;
		this.root.toggleItem(this.opts.value.current, this.opts.id.current);
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.#isDisabled) return;
		if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
			e.preventDefault();
			this.#toggleItem();
			return;
		}
		if (!this.root.opts.rovingFocus.current) return;

		this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
	}

	#tabIndex = $state(0);

	readonly snippetProps = $derived.by(() => ({
		pressed: this.isPressed,
	}));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: this.root.isMulti ? undefined : 'radio',
				tabindex: this.#tabIndex,
				'data-orientation': this.root.opts.orientation.current,
				'data-disabled': this.#isDisabled ? '' : undefined,
				'data-state': this.isPressed ? 'on' : 'off',
				'data-value': this.opts.value.current,
				'aria-pressed': this.#ariaPressed,
				'aria-checked': this.#ariaChecked,
				disabled: this.#isDisabled ? true : undefined,
				[toggleGroupAttrs.item]: '',
				//
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				...this.attachment,
			}) as const,
	);
}
