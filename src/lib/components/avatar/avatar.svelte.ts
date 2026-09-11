import { createContext, untrack } from 'svelte';
import { DOMContext, attachRef } from '../../internal/tools/index.js';
import type { HTMLImgAttributes } from 'svelte/elements';
import type { AvatarImageLoadingStatus } from './types.js';
import type { RefAttachment, RefOpts } from '../../internal/types.js';
import { createBitsAttrs } from '../../internal/attrs.js';

const avatarAttrs = createBitsAttrs({
	component: 'avatar',
	parts: ['root', 'image', 'fallback'],
});

type CrossOrigin = HTMLImgAttributes['crossorigin'];
type ReferrerPolicy = HTMLImgAttributes['referrerpolicy'];
type AvatarImageSrc = string | null | undefined;

interface AvatarRootStateOpts extends RefOpts {
	readonly delayMs: number;
	loadingStatus: AvatarImageLoadingStatus;
}

const [getAvatarRoot, setAvatarRoot] = createContext<AvatarRootState>();

export class AvatarRootState {
	static create(opts: AvatarRootStateOpts) {
		return setAvatarRoot(new AvatarRootState(opts));
	}

	readonly opts: AvatarRootStateOpts;
	readonly domContext: DOMContext;
	readonly attachment: RefAttachment;

	constructor(opts: AvatarRootStateOpts) {
		this.opts = opts;
		this.domContext = new DOMContext(() => opts.ref);
		this.loadImage = this.loadImage.bind(this);
		this.attachment = attachRef<HTMLElement>((v) => (opts.ref = v));
	}

	loadImage(src: string, crossorigin?: CrossOrigin, referrerPolicy?: ReferrerPolicy) {
		if (this.opts.loadingStatus === 'loaded') return;
		let imageTimerId: number;
		const image = new Image();

		image.src = src;
		if (crossorigin !== undefined) image.crossOrigin = crossorigin;
		if (referrerPolicy) image.referrerPolicy = referrerPolicy;

		this.opts.loadingStatus = 'loading';
		image.onload = () => {
			imageTimerId = this.domContext.setTimeout(() => {
				this.opts.loadingStatus = 'loaded';
			}, this.opts.delayMs);
		};
		image.onerror = () => {
			this.opts.loadingStatus = 'error';
		};
		return () => {
			if (!imageTimerId) return;
			this.domContext.clearTimeout(imageTimerId);
		};
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id,
				[avatarAttrs.root]: '',
				'data-status': this.opts.loadingStatus,
				...this.attachment,
			}) as const,
	);
}

interface AvatarImageStateOpts extends RefOpts {
	readonly src: AvatarImageSrc;
	readonly crossOrigin: CrossOrigin;
	readonly referrerPolicy: ReferrerPolicy;
}

export class AvatarImageState {
	static create(opts: AvatarImageStateOpts) {
		return new AvatarImageState(opts, getAvatarRoot());
	}
	readonly opts: AvatarImageStateOpts;
	readonly root: AvatarRootState;
	readonly attachment: RefAttachment;

	constructor(opts: AvatarImageStateOpts, root: AvatarRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef<HTMLElement>((v) => (opts.ref = v));

		$effect.pre(() => {
			const src = this.opts.src;
			const crossOrigin = this.opts.crossOrigin;
			untrack(() => {
				if (!src) {
					this.root.opts.loadingStatus = 'error';
					return;
				}
				this.root.loadImage(src, crossOrigin, this.opts.referrerPolicy);
			});
		});
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id,
				style: {
					display: this.root.opts.loadingStatus === 'loaded' ? 'block' : 'none',
				},
				'data-status': this.root.opts.loadingStatus,
				[avatarAttrs.image]: '',
				src: this.opts.src,
				crossorigin: this.opts.crossOrigin,
				referrerpolicy: this.opts.referrerPolicy,
				...this.attachment,
			}) as const,
	);
}

interface AvatarFallbackStateOpts extends RefOpts {}
export class AvatarFallbackState {
	static create(opts: AvatarFallbackStateOpts) {
		return new AvatarFallbackState(opts, getAvatarRoot());
	}

	readonly opts: AvatarFallbackStateOpts;
	readonly root: AvatarRootState;
	readonly attachment: RefAttachment;

	constructor(opts: AvatarFallbackStateOpts, root: AvatarRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef<HTMLElement>((v) => (opts.ref = v));
	}

	readonly style = $derived.by(() => (this.root.opts.loadingStatus === 'loaded' ? { display: 'none' } : undefined));

	readonly props = $derived.by(
		() =>
			({
				style: this.style,
				'data-status': this.root.opts.loadingStatus,
				[avatarAttrs.fallback]: '',
				...this.attachment,
			}) as const,
	);
}
