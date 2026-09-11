import { attachRef } from '../../internal/tools/index.js';
import { createBitsAttrs, boolToStr, boolToEmptyStrOrUndef, boolToTrueOrUndef } from '../../internal/attrs.js';
import type { BitsMouseEvent, RefAttachment, RefOpts } from '../../internal/types.js';

export const toggleAttrs = createBitsAttrs({
	component: 'toggle',
	parts: ['root'],
});

interface ToggleRootStateOpts extends RefOpts {
	readonly disabled: boolean;
	pressed: boolean;
}

export class ToggleRootState {
	static create(opts: ToggleRootStateOpts) {
		return new ToggleRootState(opts);
	}
	readonly opts: ToggleRootStateOpts;
	readonly attachment: RefAttachment;

	constructor(opts: ToggleRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef<HTMLElement>((v) => (opts.ref = v));
		this.onclick = this.onclick.bind(this);
	}

	onclick(_: BitsMouseEvent) {
		if (this.opts.disabled) return;
		this.opts.pressed = !this.opts.pressed;
	}

	readonly snippetProps = $derived.by(() => ({
		pressed: this.opts.pressed,
	}));

	readonly props = $derived.by(
		() =>
			({
				[toggleAttrs.root]: '',
				id: this.opts.id,
				'data-disabled': boolToEmptyStrOrUndef(this.opts.disabled),
				'aria-pressed': boolToStr(this.opts.pressed),
				'data-state': getToggleDataState(this.opts.pressed),
				disabled: boolToTrueOrUndef(this.opts.disabled),
				onclick: this.onclick,
				...this.attachment,
			}) as const,
	);
}

export const getToggleDataState = (condition: boolean): 'on' | 'off' => condition ? 'on' : 'off';
