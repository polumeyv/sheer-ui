import { attachRef, type ReadableBoxedValues } from '$lib/internal/tools/index.js';
import { createBitsAttrs } from '$lib/internal/attrs.js';
import type { RefAttachment, WithRefOpts } from '$lib/internal/types.js';

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

	readonly props = $derived.by(() => {
		const value = this.opts.value.current;
		const percent = getProgressPercent(value, this.opts.min.current, this.opts.max.current);
		const isIndeterminate = value === null;
		return {
			role: 'progressbar',
			value,
			'aria-valuemin': this.opts.min.current,
			'aria-valuemax': this.opts.max.current,
			'aria-valuenow': isIndeterminate ? undefined : value,
			'data-value': isIndeterminate ? undefined : value,
			'data-state': value === null ? 'indeterminate' : percent === 100 ? 'loaded' : 'loading',
			'data-max': this.opts.max.current,
			'data-min': this.opts.min.current,
			'data-indeterminate': isIndeterminate ? '' : undefined,
			[progressAttrs.root]: '',
			...this.attachment,
		} as const;
	});
}
