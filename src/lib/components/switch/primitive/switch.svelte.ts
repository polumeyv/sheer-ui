import { createContext } from 'svelte';
import { attachRef, type RefAttachment } from '$lib/vendor/attach-ref';
import { createBitsAttrs } from '$lib/vendor/attrs';
import { kbd } from '$lib/vendor/kbd';
import type { ReadableProps, WithRefProps, WritableProps } from '$lib/vendor/utils';
import type { BitsKeyboardEvent, BitsPointerEvent } from '$lib/vendor/types';

const switchAttrs = createBitsAttrs({
	component: 'switch',
	parts: ['root', 'thumb'],
});

const [getSwitchRootContext, setSwitchRootContext] = createContext<SwitchRootState>();

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
		this.attachment = attachRef<HTMLElement>((v) => (opts.ref.current = v));

		this.onkeydown = this.onkeydown.bind(this);
		this.onclick = this.onclick.bind(this);
	}

	#toggle() {
		this.opts.checked.current = !this.opts.checked.current;
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (!(e.key === kbd.ENTER || e.key === kbd.SPACE) || this.opts.disabled.current) return;
		e.preventDefault();
		this.#toggle();
	}

	onclick(_: BitsPointerEvent) {
		if (this.opts.disabled.current) return;
		this.#toggle();
	}

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
				id: this.opts.id.current,
				role: 'switch',
				disabled: this.opts.disabled.current ? true : undefined,
				'aria-checked': this.opts.checked.current ? 'true' : 'false',
				'aria-required': this.opts.required.current ? 'true' : 'false',
				[switchAttrs.root]: '',
				//
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				...this.attachment,
			}) as const,
	);
}

export class SwitchInputState {
	static create() {
		return new SwitchInputState(getSwitchRootContext());
	}
	readonly root: SwitchRootState;
	readonly shouldRender = $derived.by(() => this.root.opts.name.current !== undefined);

	constructor(root: SwitchRootState) {
		this.root = root;
	}

	readonly props = $derived.by(
		() =>
			({
				type: 'checkbox',
				name: this.root.opts.name.current,
				value: this.root.opts.value.current,
				checked: this.root.opts.checked.current,
				disabled: this.root.opts.disabled.current,
				required: this.root.opts.required.current,
			}) as const,
	);
}

interface SwitchThumbStateOpts extends WithRefProps {}

export class SwitchThumbState {
	static create(opts: SwitchThumbStateOpts) {
		return new SwitchThumbState(opts, getSwitchRootContext());
	}
	readonly opts: SwitchThumbStateOpts;
	readonly root: SwitchRootState;
	readonly attachment: RefAttachment;

	constructor(opts: SwitchThumbStateOpts, root: SwitchRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef<HTMLElement>((v) => (opts.ref.current = v));
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
