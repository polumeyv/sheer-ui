import { createContext } from 'svelte';
import { attachRef, type ReadableBoxedValues, type WritableBoxedValues } from '$lib/internal/tools/index.js';
import { getAriaChecked, boolToStr, boolToTrueOrUndef, createBitsAttrs, boolToEmptyStrOrUndef } from '$lib/internal/attrs.js';
import { kbd } from '$lib/internal/kbd.js';
import type { BitsKeyboardEvent, BitsPointerEvent, RefAttachment, WithRefOpts } from '$lib/internal/types.js';

const switchAttrs = createBitsAttrs({
	component: 'switch',
	parts: ['root', 'thumb'],
});

const [getSwitchRoot, setSwitchRoot] = createContext<SwitchRootState>();

interface SwitchRootStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
			required: boolean;
		}>,
		WritableBoxedValues<{
			checked: boolean;
		}> {}
export class SwitchRootState {
	static create(opts: SwitchRootStateOpts) {
		return setSwitchRoot(new SwitchRootState(opts));
	}
	readonly opts: SwitchRootStateOpts;
	readonly attachment: RefAttachment;

	constructor(opts: SwitchRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(opts.ref);

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
		'data-disabled': boolToEmptyStrOrUndef(this.opts.disabled.current),
		'data-state': this.opts.checked.current ? 'checked' : 'unchecked',
		'data-required': boolToEmptyStrOrUndef(this.opts.required.current),
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
				disabled: boolToTrueOrUndef(this.opts.disabled.current),
				'aria-checked': getAriaChecked(this.opts.checked.current, false),
				'aria-required': boolToStr(this.opts.required.current),
				[switchAttrs.root]: '',
				//
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				...this.attachment,
			}) as const,
	);
}

interface SwitchThumbStateOpts extends WithRefOpts {}

export class SwitchThumbState {
	static create(opts: SwitchThumbStateOpts) {
		return new SwitchThumbState(opts, getSwitchRoot());
	}
	readonly opts: SwitchThumbStateOpts;
	readonly root: SwitchRootState;
	readonly attachment: RefAttachment;

	constructor(opts: SwitchThumbStateOpts, root: SwitchRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref);
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
