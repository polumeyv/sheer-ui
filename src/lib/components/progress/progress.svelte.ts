import { attachRef, type ReadableBoxedValues } from '$lib/internal/tools/index.js';
import { createBitsAttrs } from '$lib/internal/attrs.js';
import type { RefAttachment, WithRefOpts } from '$lib/internal/types.js';

const progressAttrs = createBitsAttrs({
	component: 'progress',
	parts: ['root'],
});

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
		const isIndeterminate = value === null;
		return {
			role: 'progressbar',
			value,
			'aria-valuemin': this.opts.min.current,
			'aria-valuemax': this.opts.max.current,
			'aria-valuenow': isIndeterminate ? undefined : value,
			'data-value': isIndeterminate ? undefined : value,
			'data-state': value === null ? 'indeterminate' : value === this.opts.max.current ? 'loaded' : 'loading',
			'data-max': this.opts.max.current,
			'data-min': this.opts.min.current,
			'data-indeterminate': isIndeterminate ? '' : undefined,
			[progressAttrs.root]: '',
			...this.attachment,
		} as const;
	});
}
