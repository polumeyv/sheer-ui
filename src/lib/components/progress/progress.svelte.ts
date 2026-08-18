import { attachRef, type ReadableBoxedValues } from '../../internal/tools/index.js';
import { boolToEmptyStrOrUndef, createBitsAttrs, valueRangeProps } from '../../internal/attrs.js';
import type { RefAttachment, WithRefOpts } from '../../internal/types.js';

const progressAttrs = createBitsAttrs({
	component: 'progress',
	parts: ['root'],
});

export function getProgressPercent(value: number | null, min: number, max: number): number | null {
	if (value === null) return null;
	const range = max - min;
	if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max) || range <= 0) return 0;
	return Math.min(100, Math.max(0, ((value - min) / range) * 100));
}

interface ProgressRootStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			value: number | null;
			max: number;
			min: number;
		}> {}

export class ProgressRootState {
	static create(opts: ProgressRootStateOpts) {
		return new ProgressRootState(opts);
	}

	readonly opts: ProgressRootStateOpts;
	readonly attachment: RefAttachment;

	constructor(opts: ProgressRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
	}

	readonly percent = $derived.by(() => getProgressPercent(this.opts.value.current, this.opts.min.current, this.opts.max.current));

	readonly props = $derived.by(() => {
		const value = this.opts.value.current;
		return {
			...valueRangeProps(value, this.opts.min.current, this.opts.max.current),
			role: 'progressbar',
			'data-state': value === null ? 'indeterminate' : this.percent === 100 ? 'loaded' : 'loading',
			'data-indeterminate': boolToEmptyStrOrUndef(value === null),
			[progressAttrs.root]: '',
			...this.attachment,
		} as const;
	});
}
