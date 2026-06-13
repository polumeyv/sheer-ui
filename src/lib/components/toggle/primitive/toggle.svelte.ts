import { attachRef, type RefAttachment } from '$lib/internal/attach-ref.js';
import { createBitsAttrs } from '$lib/internal/attrs.js';
import type { ReadableProps, WithRefProps, WritableProps } from '$lib/vendor/utils.js';
import type { BitsMouseEvent } from '$lib/internal/types.js';

export const toggleAttrs = createBitsAttrs({
	component: 'toggle',
	parts: ['root'],
});

interface ToggleRootStateOpts
	extends
		WithRefProps,
		ReadableProps<{
			disabled: boolean;
		}>,
		WritableProps<{
			pressed: boolean;
		}> {}

export class ToggleRootState {
	static create(opts: ToggleRootStateOpts) {
		return new ToggleRootState(opts);
	}
	readonly opts: ToggleRootStateOpts;
	readonly attachment: RefAttachment;

	constructor(opts: ToggleRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef<HTMLElement>((v) => (this.opts.ref.current = v));
		this.onclick = this.onclick.bind(this);
	}

	onclick(_: BitsMouseEvent) {
		if (this.opts.disabled.current) return;
		this.opts.pressed.current = !this.opts.pressed.current;
	}

	readonly snippetProps = $derived.by(() => ({
		pressed: this.opts.pressed.current,
	}));

	readonly props = $derived.by(
		() =>
			({
				[toggleAttrs.root]: '',
				id: this.opts.id.current,
				'data-disabled': this.opts.disabled.current ? '' : undefined,
				'aria-pressed': this.opts.pressed.current ? 'true' : 'false',
				'data-state': getToggleDataState(this.opts.pressed.current),
				disabled: this.opts.disabled.current ? true : undefined,
				onclick: this.onclick,
				...this.attachment,
			}) as const,
	);
}

export function getToggleDataState(condition: boolean): 'on' | 'off' {
	return condition ? 'on' : 'off';
}
