import { attachRef, type ReadableProps } from '$lib/vendor/index.js';
import type { RefAttachment, WithRefProps } from '$lib/internal/types.js';
import { createBitsAttrs } from '$lib/internal/attrs.js';

const aspectRatioAttrs = createBitsAttrs({
	component: 'aspect-ratio',
	parts: ['root'],
});

interface AspectRatioRootStateOpts extends WithRefProps, ReadableProps<{ ratio: number }> {}

export class AspectRatioRootState {
	static create(opts: AspectRatioRootStateOpts) {
		return new AspectRatioRootState(opts);
	}

	readonly opts: AspectRatioRootStateOpts;
	readonly attachment: RefAttachment;

	constructor(opts: AspectRatioRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				style: {
					position: 'absolute',
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
				},
				[aspectRatioAttrs.root]: '',
				...this.attachment,
			}) as const,
	);
}
