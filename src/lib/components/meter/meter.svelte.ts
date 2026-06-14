import { attachRef, type ReadableProps } from '$lib/vendor/index';
import type { RefAttachment, WithRefProps } from '$lib/vendor/types';
import { createBitsAttrs } from '$lib/vendor/attrs';

const meterAttrs = createBitsAttrs({
	component: 'meter',
	parts: ['root'],
});

interface MeterRootStateOpts
	extends
		WithRefProps,
		ReadableProps<{
			value: number;
			max: number;
			min: number;
		}> {}

export class MeterRootState {
	static create(opts: MeterRootStateOpts) {
		return new MeterRootState(opts);
	}

	readonly opts: MeterRootStateOpts;
	readonly attachment: RefAttachment;

	constructor(opts: MeterRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
	}

	readonly props = $derived.by(
		() =>
			({
				role: 'meter',
				value: this.opts.value.current,
				'aria-valuemin': this.opts.min.current,
				'aria-valuemax': this.opts.max.current,
				'aria-valuenow': this.opts.value.current,
				'data-value': this.opts.value.current,
				'data-max': this.opts.max.current,
				'data-min': this.opts.min.current,
				[meterAttrs.root]: '',
				...this.attachment,
			}) as const,
	);
}
