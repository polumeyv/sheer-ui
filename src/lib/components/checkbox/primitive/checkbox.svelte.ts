import { createContext, getContext, hasContext, setContext, untrack } from 'svelte';
import { attachRef, type ReadableProps, type WritableProps } from '$lib/vendor/index.js';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { BitsFocusEvent, BitsKeyboardEvent, BitsMouseEvent, OnChangeFn, RefAttachment, WithRefProps } from '$lib/internal/types.js';
import { createBitsAttrs } from '$lib/internal/attrs.js';
import { kbd } from '$lib/internal/kbd.js';
import { arraysAreEqual } from '$lib/internal/arrays.js';

const checkboxAttrs = createBitsAttrs({
	component: 'checkbox',
	parts: ['root', 'group', 'group-label', 'input'],
});

interface CheckboxGroupStateOpts
	extends
		WithRefProps,
		ReadableProps<{
			name: string | undefined;
			disabled: boolean;
			required: boolean;
			readonly: boolean;
			onValueChange: OnChangeFn<string[]>;
		}>,
		WritableProps<{
			value: string[];
		}> {}

const checkboxGroupContextKey = Symbol('Checkbox.Group');
export function getCheckboxGroupContext(): CheckboxGroupState {
	if (!hasContext(checkboxGroupContextKey)) throw new Error('Context "Checkbox.Group" not found');
	return getContext<CheckboxGroupState>(checkboxGroupContextKey);
}
export function getCheckboxGroupContextOr<T>(fallback: T): CheckboxGroupState | T {
	return hasContext(checkboxGroupContextKey) ? getContext<CheckboxGroupState>(checkboxGroupContextKey) : fallback;
}
export function setCheckboxGroupContext(state: CheckboxGroupState): CheckboxGroupState {
	return setContext(checkboxGroupContextKey, state);
}

export class CheckboxGroupState {
	static create(opts: CheckboxGroupStateOpts) {
		return setCheckboxGroupContext(new CheckboxGroupState(opts));
	}

	readonly opts: CheckboxGroupStateOpts;
	readonly attachment: RefAttachment;
	labelId = $state<string | undefined>(undefined);

	constructor(opts: CheckboxGroupStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
	}

	addValue(checkboxValue: string | undefined) {
		if (!checkboxValue) return;
		if (!this.opts.value.current.includes(checkboxValue)) {
			const newValue = [...$state.snapshot(this.opts.value.current), checkboxValue];
			this.opts.value.current = newValue;
			if (arraysAreEqual(this.opts.value.current, newValue)) return;
			this.opts.onValueChange.current(newValue);
		}
	}

	removeValue(checkboxValue: string | undefined) {
		if (!checkboxValue) return;
		const index = this.opts.value.current.indexOf(checkboxValue);
		if (index === -1) return;
		const newValue = this.opts.value.current.filter((v) => v !== checkboxValue);
		this.opts.value.current = newValue;
		if (arraysAreEqual(this.opts.value.current, newValue)) return;
		this.opts.onValueChange.current(newValue);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: 'group',
				'aria-labelledby': this.labelId,
				'data-disabled': this.opts.disabled.current ? '' : undefined,
				[checkboxAttrs.group]: '',
				...this.attachment,
			}) as const,
	);
}

interface CheckboxGroupLabelStateOpts extends WithRefProps {}

export class CheckboxGroupLabelState {
	static create(opts: CheckboxGroupLabelStateOpts) {
		return new CheckboxGroupLabelState(opts, getCheckboxGroupContext());
	}

	readonly opts: CheckboxGroupLabelStateOpts;
	readonly group: CheckboxGroupState;
	readonly attachment: RefAttachment;

	constructor(opts: CheckboxGroupLabelStateOpts, group: CheckboxGroupState) {
		this.opts = opts;
		this.group = group;
		this.group.labelId = this.opts.id.current;
		this.attachment = attachRef(this.opts.ref);

		$effect.pre(() => {
			const id = this.opts.id.current;
			untrack(() => {
				this.group.labelId = id;
			});
		});
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				'data-disabled': this.group.opts.disabled.current ? '' : undefined,
				[checkboxAttrs['group-label']]: '',
				...this.attachment,
			}) as const,
	);
}

const [getCheckboxRootContext, setCheckboxRootContext] = createContext<CheckboxRootState>();

interface CheckboxRootStateOpts
	extends
		WithRefProps,
		ReadableProps<{
			disabled: boolean;
			required: boolean;
			readonly: boolean;
			name: string | undefined;
			value: string | undefined;
			type: HTMLButtonAttributes['type'];
		}>,
		WritableProps<{
			checked: boolean;
			indeterminate: boolean;
		}> {}

export class CheckboxRootState {
	static create(opts: CheckboxRootStateOpts, group: CheckboxGroupState | null = null) {
		return setCheckboxRootContext(new CheckboxRootState(opts, group));
	}

	readonly opts: CheckboxRootStateOpts;
	readonly group: CheckboxGroupState | null;
	readonly trueName = $derived.by(() => {
		if (this.group && this.group.opts.name.current) return this.group.opts.name.current;
		return this.opts.name.current;
	});
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

		$effect.pre(() => {
			const [groupValue, value] = [$state.snapshot(this.group?.opts.value.current), this.opts.value.current];
			untrack(() => {
				if (!groupValue || !value) return;
				this.opts.checked.current = groupValue.includes(value);
			});
		});

		$effect.pre(() => {
			const checked = this.opts.checked.current;
			untrack(() => {
				if (!this.group) return;
				if (checked) {
					this.group?.addValue(this.opts.value.current);
				} else {
					this.group?.removeValue(this.opts.value.current);
				}
			});
		});
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
				'aria-checked': this.opts.indeterminate.current ? 'mixed' : this.opts.checked.current ? 'true' : 'false',
				'aria-required': this.trueRequired ? 'true' : 'false',
				'aria-readonly': this.trueReadonly ? 'true' : 'false',
				'data-disabled': this.trueDisabled ? '' : undefined,
				'data-readonly': this.trueReadonly ? '' : undefined,
				'data-state': getCheckboxDataState(this.opts.checked.current, this.opts.indeterminate.current),
				[checkboxAttrs.root]: '',
				//
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				...this.attachment,
			}) as const,
	);
}

export class CheckboxInputState {
	static create() {
		return new CheckboxInputState(getCheckboxRootContext());
	}

	readonly root: CheckboxRootState;
	readonly trueChecked = $derived.by(() => {
		if (!this.root.group) return this.root.opts.checked.current;
		if (this.root.opts.value.current !== undefined && this.root.group.opts.value.current.includes(this.root.opts.value.current)) {
			return true;
		}
		return false;
	});
	readonly shouldRender = $derived.by(() => Boolean(this.root.trueName));

	constructor(root: CheckboxRootState) {
		this.root = root;
		this.onfocus = this.onfocus.bind(this);
	}

	onfocus(_: BitsFocusEvent) {
		if (!(this.root.opts.ref.current instanceof HTMLElement)) return;
		this.root.opts.ref.current.focus();
	}

	readonly props = $derived.by(
		() =>
			({
				type: 'checkbox',
				checked: this.root.opts.checked.current === true,
				disabled: this.root.trueDisabled,
				required: this.root.trueRequired,
				name: this.root.trueName,
				value: this.root.opts.value.current,
				readonly: this.root.trueReadonly,
				onfocus: this.onfocus,
			}) as const,
	);
}

function getCheckboxDataState(checked: boolean, indeterminate: boolean) {
	if (indeterminate) return 'indeterminate';
	return checked ? 'checked' : 'unchecked';
}
