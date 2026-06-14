import { attachRef } from '$lib/vendor/index';
import type { BitsMouseEvent, RefAttachment, Without, WithRefProps, WithChild } from '$lib/vendor/types';
import { createBitsAttrs } from '$lib/vendor/attrs';

import type { BitsPrimitiveLabelAttributes } from "$lib/shared/attributes";

export type LabelRootPropsWithoutHTML = WithChild;

export type LabelRootProps = LabelRootPropsWithoutHTML &
	Without<BitsPrimitiveLabelAttributes, LabelRootPropsWithoutHTML>;


const labelAttrs = createBitsAttrs({
	component: 'label',
	parts: ['root'],
});

interface LabelRootStateOpts extends WithRefProps {}

export class LabelRootState {
	static create(opts: LabelRootStateOpts) {
		return new LabelRootState(opts);
	}

	readonly opts: LabelRootStateOpts;
	readonly attachment: RefAttachment;

	constructor(opts: LabelRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
		this.onmousedown = this.onmousedown.bind(this);
	}

	onmousedown(e: BitsMouseEvent) {
		if (e.detail > 1) e.preventDefault();
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[labelAttrs.root]: '',
				onmousedown: this.onmousedown,
				...this.attachment,
			}) as const,
	);
}
