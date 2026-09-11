import { attachRef } from '../../internal/tools/index.js';
import { createBitsAttrs } from '../../internal/attrs.js';
import type { RefAttachment, RefOpts } from '../../internal/types.js';

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

interface ProgressRootStateOpts extends RefOpts {
	readonly value: number | null;
	readonly max: number;
	readonly min: number;
}

export class ProgressRootState {
	static create(opts: ProgressRootStateOpts) {
		return new ProgressRootState(opts);
	}

	readonly opts: ProgressRootStateOpts;
	readonly attachment: RefAttachment;

	constructor(opts: ProgressRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef<HTMLElement>((v) => (opts.ref = v));
	}

	readonly props = $derived.by(() => {
		const { value, min, max } = this.opts;
		const percent = getProgressPercent(value, min, max);
		const isIndeterminate = value === null;
		return {
			role: 'progressbar',
			value,
			'aria-valuemin': min,
			'aria-valuemax': max,
			'aria-valuenow': isIndeterminate ? undefined : value,
			'data-value': isIndeterminate ? undefined : value,
			'data-state': value === null ? 'indeterminate' : percent === 100 ? 'loaded' : 'loading',
			'data-max': max,
			'data-min': min,
			'data-indeterminate': isIndeterminate ? '' : undefined,
			[progressAttrs.root]: '',
			...this.attachment,
		} as const;
	});
}
