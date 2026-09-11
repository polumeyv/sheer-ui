import { attachRef } from '../../internal/tools/index.js';
import { createBitsAttrs, boolToStrTrueOrUndef } from '../../internal/attrs.js';
import type { RefAttachment, RefOpts } from '../../internal/types.js';
import type { Orientation } from '../../internal/index.js';

const separatorAttrs = createBitsAttrs({
	component: 'separator',
	parts: ['root'],
});

interface SeparatorRootStateOpts extends RefOpts {
	readonly orientation: Orientation;
	readonly decorative: boolean;
}

export class SeparatorRootState {
	static create(opts: SeparatorRootStateOpts) {
		return new SeparatorRootState(opts);
	}
	readonly opts: SeparatorRootStateOpts;
	readonly attachment: RefAttachment;

	constructor(opts: SeparatorRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef<HTMLElement>((v) => (opts.ref = v));
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id,
				role: this.opts.decorative ? 'none' : 'separator',
				'aria-orientation': this.opts.orientation,
				'aria-hidden': boolToStrTrueOrUndef(this.opts.decorative),
				'data-orientation': this.opts.orientation,
				[separatorAttrs.root]: '',
				...this.attachment,
			}) as const,
	);
}
