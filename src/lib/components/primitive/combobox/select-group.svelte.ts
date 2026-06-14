import { createContext } from 'svelte';
import { attachRef, type RefAttachment } from '$lib/vendor/index';
import type { WithRefProps } from '$lib/vendor/types';
import { getSelectRootContext, type SelectBaseRootState } from './select-root.svelte';

const [getSelectGroupContext, setSelectGroupContext] = createContext<SelectGroupState>();

interface SelectGroupStateOpts extends WithRefProps {}

export class SelectGroupState {
	static create(opts: SelectGroupStateOpts) {
		return setSelectGroupContext(new SelectGroupState(opts, getSelectRootContext()));
	}
	readonly opts: SelectGroupStateOpts;
	readonly root: SelectBaseRootState;
	labelNode = $state<HTMLElement | null>(null);
	readonly attachment: RefAttachment;

	constructor(opts: SelectGroupStateOpts, root: SelectBaseRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: 'group',
				[this.root.getBitsAttr('group')]: '',
				'aria-labelledby': this.labelNode?.id ?? undefined,
				...this.attachment,
			}) as const,
	);
}

interface SelectGroupHeadingStateOpts extends WithRefProps {}

export class SelectGroupHeadingState {
	static create(opts: SelectGroupHeadingStateOpts) {
		return new SelectGroupHeadingState(opts, getSelectGroupContext());
	}
	readonly opts: SelectGroupHeadingStateOpts;
	readonly group: SelectGroupState;
	readonly attachment: RefAttachment;

	constructor(opts: SelectGroupHeadingStateOpts, group: SelectGroupState) {
		this.opts = opts;
		this.group = group;
		this.attachment = attachRef(opts.ref, (v) => (this.group.labelNode = v));
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[this.group.root.getBitsAttr('group-label')]: '',
				...this.attachment,
			}) as const,
	);
}
