import { attachRef, type ReadableProps } from '$lib/vendor/index';
import { createBitsAttrs } from '$lib/vendor/attrs';
import type { RefAttachment, WithRefProps } from '$lib/vendor/types';
import type { Orientation } from '$lib/shared/index';

const separatorAttrs = createBitsAttrs({
	component: 'separator',
	parts: ['root'],
});

interface SeparatorRootStateOpts
	extends
		WithRefProps,
		ReadableProps<{
			orientation: Orientation;
			decorative: boolean;
		}> {}

export class SeparatorRootState {
	static create(opts: SeparatorRootStateOpts) {
		return new SeparatorRootState(opts);
	}
	readonly opts: SeparatorRootStateOpts;
	readonly attachment: RefAttachment;

	constructor(opts: SeparatorRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(opts.ref);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: this.opts.decorative.current ? 'none' : 'separator',
				'aria-orientation': this.opts.orientation.current,
				'aria-hidden': this.opts.decorative.current ? 'true' : undefined,
				'data-orientation': this.opts.orientation.current,
				[separatorAttrs.root]: '',
				...this.attachment,
			}) as const,
	);
}
