import { createContext } from 'svelte';
import { joinGroup } from '../../internal/group-value.svelte.js';
import { attachRef, type ReadableBoxedValues, type WritableBoxedValues } from '../../internal/tools/index.js';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { BitsKeyboardEvent, BitsMouseEvent, RefAttachment, WithRefOpts } from '../../internal/types.js';
import { boolToStr, createBitsAttrs, getAriaChecked, boolToEmptyStrOrUndef } from '../../internal/attrs.js';
import { kbd } from '../../internal/kbd.js';

const checkboxAttrs = createBitsAttrs({
	component: 'checkbox',
	parts: ['root', 'group', 'group-label', 'input'],
});

interface CheckboxGroupStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
			required: boolean;
			readonly: boolean;
		}>,
		WritableBoxedValues<{
			value: string[];
		}> {}

const [getCheckboxGroup, setCheckboxGroup, hasCheckboxGroup] = createContext<CheckboxGroupState>();

export class CheckboxGroupState {
	static create(opts: CheckboxGroupStateOpts) {
		return setCheckboxGroup(new CheckboxGroupState(opts));
	}

	readonly opts: CheckboxGroupStateOpts;
	readonly attachment: RefAttachment;
	labelState = $state<CheckboxGroupLabelState | null>(null);
	readonly labelId = $derived.by(() => this.labelState?.opts.id.current);

	constructor(opts: CheckboxGroupStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: 'group',
				'aria-labelledby': this.labelId,
				'data-disabled': boolToEmptyStrOrUndef(this.opts.disabled.current),
				[checkboxAttrs.group]: '',
				...this.attachment,
			}) as const,
	);
}

interface CheckboxGroupLabelStateOpts extends WithRefOpts {}

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
		this.attachment = attachRef(this.opts.ref);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				'data-disabled': boolToEmptyStrOrUndef(this.group.opts.disabled.current),
				[checkboxAttrs['group-label']]: '',
				...this.attachment,
			}) as const,
	);
}

const [, setCheckboxRoot] = createContext<CheckboxRootState>();

interface CheckboxRootStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
			required: boolean;
			readonly: boolean;
			value: string | undefined;
			type: HTMLButtonAttributes['type'];
		}>,
		WritableBoxedValues<{
			checked: boolean;
			indeterminate: boolean;
		}> {}

export class CheckboxRootState {
	static create(opts: CheckboxRootStateOpts) {
		const group = hasCheckboxGroup() ? getCheckboxGroup() : null;
		return setCheckboxRoot(new CheckboxRootState(opts, group));
	}

	readonly opts: CheckboxRootStateOpts;
	readonly group: CheckboxGroupState | null;
	readonly groupChecked: () => boolean | undefined;
	readonly trueRequired = $derived.by(() => {
		if (this.group && this.group.opts.required.current) return true;
		return this.opts.required.current;
	});
	readonly trueDisabled = $derived.by(() => {
		if (this.group && this.group.opts.disabled.current) return true;
		return this.opts.disabled.current;
	});
	readonly trueReadonly = $derived.by(() => {
		if (this.group && this.group.opts.readonly.current) return true;
		return this.opts.readonly.current;
	});
	readonly attachment: RefAttachment;

	constructor(opts: CheckboxRootStateOpts, group: CheckboxGroupState | null) {
		this.opts = opts;
		this.group = group;
		this.attachment = attachRef(this.opts.ref);
		this.onkeydown = this.onkeydown.bind(this);
		this.onclick = this.onclick.bind(this);
		this.groupChecked = joinGroup(group, opts);
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.trueDisabled || this.trueReadonly) return;
		if (e.key === kbd.ENTER) {
			e.preventDefault();
			if (this.opts.type.current === 'submit') {
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
		if (this.opts.indeterminate.current) {
			this.opts.indeterminate.current = false;
			this.opts.checked.current = true;
		} else {
			this.opts.checked.current = !this.opts.checked.current;
		}
	}

	onclick(e: BitsMouseEvent) {
		if (this.trueDisabled || this.trueReadonly) return;
		if (this.opts.type.current === 'submit') {
			this.#toggle();
			return;
		}
		e.preventDefault();
		this.#toggle();
	}

	readonly snippetProps = $derived.by(() => ({
		checked: this.opts.checked.current,
		indeterminate: this.opts.indeterminate.current,
	}));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: 'checkbox',
				type: this.opts.type.current,
				disabled: this.trueDisabled,
				'aria-checked': getAriaChecked(this.opts.checked.current, this.opts.indeterminate.current),
				'aria-required': boolToStr(this.trueRequired),
				'aria-readonly': boolToStr(this.trueReadonly),
				'data-disabled': boolToEmptyStrOrUndef(this.trueDisabled),
				'data-readonly': boolToEmptyStrOrUndef(this.trueReadonly),
				'data-state': getCheckboxDataState(this.opts.checked.current, this.opts.indeterminate.current),
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
