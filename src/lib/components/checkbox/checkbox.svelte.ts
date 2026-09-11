import { createContext } from 'svelte';
import { joinGroup } from '../../internal/group-value.svelte.js';
import { attachRef } from '../../internal/tools/index.js';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { BitsKeyboardEvent, BitsMouseEvent, RefAttachment, RefOpts } from '../../internal/types.js';
import { boolToStr, createBitsAttrs, getAriaChecked, boolToEmptyStrOrUndef } from '../../internal/attrs.js';
import { kbd } from '../../internal/kbd.js';

const checkboxAttrs = createBitsAttrs({
	component: 'checkbox',
	parts: ['root', 'group', 'group-label', 'input'],
});

interface CheckboxGroupStateOpts extends RefOpts {
	readonly disabled: boolean;
	readonly required: boolean;
	readonly readonly: boolean;
	value: string[];
}

const [getCheckboxGroup, setCheckboxGroup, hasCheckboxGroup] = createContext<CheckboxGroupState>();

export class CheckboxGroupState {
	static create(opts: CheckboxGroupStateOpts) {
		return setCheckboxGroup(new CheckboxGroupState(opts));
	}

	readonly opts: CheckboxGroupStateOpts;
	readonly attachment: RefAttachment;
	labelState = $state<CheckboxGroupLabelState | null>(null);
	readonly labelId = $derived.by(() => this.labelState?.opts.id);

	constructor(opts: CheckboxGroupStateOpts) {
		this.opts = opts;
		this.attachment = attachRef<HTMLElement>((v) => (opts.ref = v));
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id,
				role: 'group',
				'aria-labelledby': this.labelId,
				'data-disabled': boolToEmptyStrOrUndef(this.opts.disabled),
				[checkboxAttrs.group]: '',
				...this.attachment,
			}) as const,
	);
}

interface CheckboxGroupLabelStateOpts extends RefOpts {}

export class CheckboxGroupLabelState {
	static create(opts: CheckboxGroupLabelStateOpts) {
		return new CheckboxGroupLabelState(opts, getCheckboxGroup());
	}

	readonly opts: CheckboxGroupLabelStateOpts;
	readonly group: CheckboxGroupState;
	readonly attachment: RefAttachment;

	constructor(opts: CheckboxGroupLabelStateOpts, group: CheckboxGroupState) {
		this.opts = opts;
		this.group = group;
		this.group.labelState = this;
		this.attachment = attachRef<HTMLElement>((v) => (opts.ref = v));
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id,
				'data-disabled': boolToEmptyStrOrUndef(this.group.opts.disabled),
				[checkboxAttrs['group-label']]: '',
				...this.attachment,
			}) as const,
	);
}

const [, setCheckboxRoot] = createContext<CheckboxRootState>();

interface CheckboxRootStateOpts extends RefOpts {
	readonly disabled: boolean;
	readonly required: boolean;
	readonly readonly: boolean;
	readonly value: string | undefined;
	readonly type: HTMLButtonAttributes['type'];
	checked: boolean;
	indeterminate: boolean;
}

export class CheckboxRootState {
	static create(opts: CheckboxRootStateOpts) {
		const group = hasCheckboxGroup() ? getCheckboxGroup() : null;
		return setCheckboxRoot(new CheckboxRootState(opts, group));
	}

	readonly opts: CheckboxRootStateOpts;
	readonly group: CheckboxGroupState | null;
	readonly groupChecked: () => boolean | undefined;
	readonly trueRequired = $derived.by(() => {
		if (this.group && this.group.opts.required) return true;
		return this.opts.required;
	});
	readonly trueDisabled = $derived.by(() => {
		if (this.group && this.group.opts.disabled) return true;
		return this.opts.disabled;
	});
	readonly trueReadonly = $derived.by(() => {
		if (this.group && this.group.opts.readonly) return true;
		return this.opts.readonly;
	});
	readonly attachment: RefAttachment;

	constructor(opts: CheckboxRootStateOpts, group: CheckboxGroupState | null) {
		this.opts = opts;
		this.group = group;
		this.attachment = attachRef<HTMLElement>((v) => (opts.ref = v));
		this.onkeydown = this.onkeydown.bind(this);
		this.onclick = this.onclick.bind(this);
		this.groupChecked = joinGroup(group?.opts ?? null, opts);
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.trueDisabled || this.trueReadonly) return;
		if (e.key === kbd.ENTER) {
			e.preventDefault();
			if (this.opts.type === 'submit') {
				const form = e.currentTarget.closest('form');
				form?.requestSubmit();
			}
			return;
		}
		if (e.key === kbd.SPACE) {
			e.preventDefault();
			this.#toggle();
		}
	}

	#toggle() {
		if (this.opts.indeterminate) {
			this.opts.indeterminate = false;
			this.opts.checked = true;
		} else {
			this.opts.checked = !this.opts.checked;
		}
	}

	onclick(e: BitsMouseEvent) {
		if (this.trueDisabled || this.trueReadonly) return;
		if (this.opts.type === 'submit') {
			this.#toggle();
			return;
		}
		e.preventDefault();
		this.#toggle();
	}

	readonly snippetProps = $derived.by(() => ({
		checked: this.opts.checked,
		indeterminate: this.opts.indeterminate,
	}));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id,
				role: 'checkbox',
				type: this.opts.type,
				disabled: this.trueDisabled,
				'aria-checked': getAriaChecked(this.opts.checked, this.opts.indeterminate),
				'aria-required': boolToStr(this.trueRequired),
				'aria-readonly': boolToStr(this.trueReadonly),
				'data-disabled': boolToEmptyStrOrUndef(this.trueDisabled),
				'data-readonly': boolToEmptyStrOrUndef(this.trueReadonly),
				'data-state': getCheckboxDataState(this.opts.checked, this.opts.indeterminate),
				[checkboxAttrs.root]: '',
				//
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				...this.attachment,
			}) as const,
	);
}

function getCheckboxDataState(checked: boolean, indeterminate: boolean) {
	if (indeterminate) return 'indeterminate';
	return checked ? 'checked' : 'unchecked';
}
