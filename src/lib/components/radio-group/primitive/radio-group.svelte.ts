import { createContext, untrack } from 'svelte';
import { attachRef, type RefAttachment } from '$lib/internal/attach-ref.js';
import type { BitsFocusEvent, BitsKeyboardEvent, BitsMouseEvent } from '$lib/internal/types.js';
import type { ReadableProps, WithRefProps, WritableProps } from '$lib/vendor/utils.js';
import { createBitsAttrs } from '$lib/internal/attrs.js';
import type { Orientation } from '$lib/shared/index.js';
import { kbd } from '$lib/internal/kbd.js';
import { RovingFocusGroup } from '$lib/internal/roving-focus-group.js';

const radioGroupAttrs = createBitsAttrs({
	component: 'radio-group',
	parts: ['root', 'item'],
});

const [getRadioGroupRootContext, setRadioGroupRootContext] = createContext<RadioGroupRootState>();

interface RadioGroupRootStateOpts
	extends
		WithRefProps,
		ReadableProps<{
			disabled: boolean;
			required: boolean;
			loop: boolean;
			orientation: Orientation;
			name: string | undefined;
			readonly: boolean;
		}>,
		WritableProps<{ value: string }> {}
export class RadioGroupRootState {
	static create(opts: RadioGroupRootStateOpts) {
		return setRadioGroupRootContext(new RadioGroupRootState(opts));
	}

	readonly opts: RadioGroupRootStateOpts;
	readonly hasValue = $derived.by(() => this.opts.value.current !== '');
	readonly rovingFocusGroup: RovingFocusGroup;
	readonly attachment: RefAttachment;

	constructor(opts: RadioGroupRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef<HTMLElement>((v) => (this.opts.ref.current = v));
		this.rovingFocusGroup = new RovingFocusGroup({
			rootNode: this.opts.ref,
			candidateAttr: radioGroupAttrs.item,
			loop: this.opts.loop,
			orientation: this.opts.orientation,
		});
	}

	isChecked(value: string) {
		return this.opts.value.current === value;
	}

	setValue(value: string) {
		this.opts.value.current = value;
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: 'radiogroup',
				'aria-required': this.opts.required.current ? 'true' : 'false',
				'aria-disabled': this.opts.disabled.current ? 'true' : 'false',
				'aria-readonly': this.opts.readonly.current ? 'true' : undefined,
				'data-disabled': this.opts.disabled.current ? '' : undefined,
				'data-readonly': this.opts.readonly.current ? '' : undefined,
				'data-orientation': this.opts.orientation.current,
				[radioGroupAttrs.root]: '',
				...this.attachment,
			}) as const,
	);
}

interface RadioGroupItemStateOpts
	extends
		WithRefProps,
		ReadableProps<{
			disabled: boolean;
			value: string;
		}> {}

export class RadioGroupItemState {
	static create(opts: RadioGroupItemStateOpts) {
		return new RadioGroupItemState(opts, getRadioGroupRootContext());
	}

	readonly opts: RadioGroupItemStateOpts;
	readonly root: RadioGroupRootState;
	readonly attachment: RefAttachment;
	readonly checked = $derived.by(() => this.root.opts.value.current === this.opts.value.current);
	readonly #isDisabled = $derived.by(() => this.opts.disabled.current || this.root.opts.disabled.current);
	readonly #isReadonly = $derived.by(() => this.root.opts.readonly.current);
	readonly #isChecked = $derived.by(() => this.root.isChecked(this.opts.value.current));
	#tabIndex = $state(-1);

	constructor(opts: RadioGroupItemStateOpts, root: RadioGroupRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef<HTMLElement>((v) => (this.opts.ref.current = v));

		if (this.opts.value.current === this.root.opts.value.current) {
			this.root.rovingFocusGroup.setCurrentTabStopId(this.opts.id.current);
			this.#tabIndex = 0;
		} else if (!this.root.opts.value.current) {
			this.#tabIndex = 0;
		}

		$effect(() => {
			this.#tabIndex = this.root.rovingFocusGroup.getTabIndex(this.opts.ref.current);
		});

		$effect(() => {
			// track both values; body untracked to mirror runed watch
			void this.opts.value.current;
			void this.root.opts.value.current;
			untrack(() => {
				if (this.opts.value.current === this.root.opts.value.current) {
					this.root.rovingFocusGroup.setCurrentTabStopId(this.opts.id.current);
					this.#tabIndex = 0;
				}
			});
		});

		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
		this.onfocus = this.onfocus.bind(this);
	}

	onclick(_: BitsMouseEvent) {
		if (this.opts.disabled.current || this.#isReadonly) return;
		this.root.setValue(this.opts.value.current);
	}

	onfocus(_: BitsFocusEvent) {
		if (!this.root.hasValue || this.#isReadonly) return;
		this.root.setValue(this.opts.value.current);
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.#isDisabled) return;
		if (e.key === kbd.SPACE) {
			e.preventDefault();
			if (!this.#isReadonly) {
				this.root.setValue(this.opts.value.current);
			}
			return;
		}
		this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e, true);
	}

	readonly snippetProps = $derived.by(() => ({ checked: this.#isChecked }));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				disabled: this.#isDisabled ? true : undefined,
				'data-value': this.opts.value.current,
				'data-orientation': this.root.opts.orientation.current,
				'data-disabled': this.#isDisabled ? '' : undefined,
				'data-readonly': this.#isReadonly ? '' : undefined,
				'data-state': this.#isChecked ? 'checked' : 'unchecked',
				'aria-checked': this.#isChecked ? 'true' : 'false',
				[radioGroupAttrs.item]: '',
				type: 'button',
				role: 'radio',
				tabindex: this.#tabIndex,
				//
				onkeydown: this.onkeydown,
				onfocus: this.onfocus,
				onclick: this.onclick,
				...this.attachment,
			}) as const,
	);
}

export class RadioGroupInputState {
	static create() {
		return new RadioGroupInputState(getRadioGroupRootContext());
	}

	readonly root: RadioGroupRootState;
	readonly shouldRender = $derived.by(() => this.root.opts.name.current !== undefined);

	constructor(root: RadioGroupRootState) {
		this.root = root;
		this.onfocus = this.onfocus.bind(this);
	}

	onfocus(_: BitsFocusEvent) {
		this.root.rovingFocusGroup.focusCurrentTabStop();
	}

	readonly props = $derived.by(
		() =>
			({
				name: this.root.opts.name.current,
				value: this.root.opts.value.current,
				required: this.root.opts.required.current,
				disabled: this.root.opts.disabled.current,
				onfocus: this.onfocus,
			}) as const,
	);
}
