import { attachRef } from '../../internal/tools/index.js';
import type { RefAttachment, RefOpts } from '../../internal/types.js';
import { createBitsAttrs } from '../../internal/attrs.js';

const meterAttrs = createBitsAttrs({
	component: 'meter',
	parts: ['root'],
});

interface MeterRootStateOpts extends RefOpts {
	readonly value: number;
	readonly max: number;
	readonly min: number;
}

export class MeterRootState {
	static create(opts: MeterRootStateOpts) {
		return new MeterRootState(opts);
	}

	readonly opts: MeterRootStateOpts;
	readonly attachment: RefAttachment;

	constructor(opts: MeterRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef<HTMLElement>((v) => (opts.ref = v));
	}

	readonly props = $derived.by(
		() =>
			({
				role: 'meter',
				value: this.opts.value,
				'aria-valuemin': this.opts.min,
				'aria-valuemax': this.opts.max,
				'aria-valuenow': this.opts.value,
				'data-value': this.opts.value,
				'data-max': this.opts.max,
				'data-min': this.opts.min,
				[meterAttrs.root]: '',
				...this.attachment,
			}) as const,
	);
}
