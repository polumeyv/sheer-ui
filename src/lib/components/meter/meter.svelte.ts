import { attachRef, type ReadableBoxedValues } from '../../internal/tools/index.js';
import type { RefAttachment, WithRefOpts } from '../../internal/types.js';
import { createBitsAttrs, valueRangeProps } from '../../internal/attrs.js';

const meterAttrs = createBitsAttrs({
	component: 'meter',
	parts: ['root'],
});

interface MeterRootStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
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
				...valueRangeProps(this.opts.value.current, this.opts.min.current, this.opts.max.current),
				role: 'meter',
				[meterAttrs.root]: '',
				...this.attachment,
			}) as const,
	);
}
