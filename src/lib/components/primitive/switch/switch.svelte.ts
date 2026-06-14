import { createContext } from 'svelte';
import { attachRef, type RefAttachment } from '$lib/vendor/attach-ref';
import { createBitsAttrs } from '$lib/vendor/attrs';
import type { ReadableProps, WithRefProps, WritableProps } from '$lib/vendor/utils';

const switchAttrs = createBitsAttrs({
	component: 'switch',
	parts: ['root', 'input', 'thumb'],
});

const [getSwitchRootContext, setSwitchRootContext] = createContext<SwitchRootState>();

export type SwitchRootPropsWithoutHTML = {
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	disabled?: boolean | null | undefined;
	required?: boolean;
	name?: string;
	value?: string;
};

interface SwitchRootStateOpts
	extends
		WithRefProps,
		ReadableProps<{
			disabled: boolean;
			required: boolean;
			name: string | undefined;
			value: string;
		}>,
		WritableProps<{
			checked: boolean;
		}> {}

export class SwitchRootState {
	static create(opts: SwitchRootStateOpts) {
		return setSwitchRootContext(new SwitchRootState(opts));
	}

	readonly opts: SwitchRootStateOpts;
	readonly attachment: RefAttachment;

	constructor(opts: SwitchRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
	}

	setChecked = (checked: boolean) => {
		this.opts.checked.current = checked;
	};

	readonly sharedProps = $derived.by(() => ({
		'data-disabled': this.opts.disabled.current ? '' : undefined,
		'data-state': this.opts.checked.current ? 'checked' : 'unchecked',
		'data-required': this.opts.required.current ? '' : undefined,
	}));

	readonly snippetProps = $derived.by(() => ({
		checked: this.opts.checked.current,
	}));

	readonly props = $derived.by(
		() =>
			({
				...this.sharedProps,
				[switchAttrs.root]: '',
				...this.attachment,
			}) as const,
	);
}

export class SwitchInputState {
	static create() {
		return new SwitchInputState(getSwitchRootContext());
	}

	readonly root: SwitchRootState;

	constructor(root: SwitchRootState) {
		this.root = root;
	}

	getChecked = () => this.root.opts.checked.current;

	setChecked = (checked: boolean) => {
		this.root.setChecked(checked);
	};

	readonly props = $derived.by(
		() =>
			({
				...this.root.sharedProps,
				role: 'switch',
				id: this.root.opts.id.current,
				name: this.root.opts.name.current,
				value: this.root.opts.value.current,
				disabled: this.root.opts.disabled.current,
				required: this.root.opts.required.current,
				'aria-required': this.root.opts.required.current ? 'true' : 'false',
				[switchAttrs.input]: '',
			}) as const,
	);
}

interface SwitchThumbStateOpts extends WithRefProps {}

export class SwitchThumbState {
	static create(opts: SwitchThumbStateOpts, root = getSwitchRootContext()) {
		return new SwitchThumbState(opts, root);
	}

	readonly opts: SwitchThumbStateOpts;
	readonly root: SwitchRootState;
	readonly attachment: RefAttachment;

	constructor(opts: SwitchThumbStateOpts, root: SwitchRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}

	readonly snippetProps = $derived.by(() => ({
		checked: this.root.opts.checked.current,
	}));

	readonly props = $derived.by(
		() =>
			({
				...this.root.sharedProps,
				id: this.opts.id.current,
				[switchAttrs.thumb]: '',
				...this.attachment,
			}) as const,
	);
}