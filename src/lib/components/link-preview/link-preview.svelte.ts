import { attachRef, DOMContext, type ReadableBoxedValues, type WritableBoxedValues } from '../../internal/tools/index.js';
import { on } from 'svelte/events';
import { createContext, onDestroy, untrack } from 'svelte';
import { createBitsAttrs, boolToStr, getDataOpenClosed } from '../../internal/attrs.js';
import { isElement } from '../../internal/tools/utils/dom.js';
import type { BitsFocusEvent, BitsPointerEvent, OnChangeFn, RefAttachment, WithRefOpts } from '../../internal/types.js';
import { getTabbableCandidates } from '../../internal/tabbable.js';
import { SafePolygon } from '../../internal/safe-polygon.svelte.js';
import { createEffectTimeout } from '../../internal/timeout-fn.svelte.js';

const linkPreviewAttrs = createBitsAttrs({
	component: 'link-preview',
	parts: ['content', 'trigger'],
});

const [getLinkPreviewRoot, setLinkPreviewRoot] = createContext<LinkPreviewRootState>();

interface LinkPreviewRootStateOpts
	extends
		WritableBoxedValues<{
			open: boolean;
		}>,
		ReadableBoxedValues<{
			disabled: boolean;
			openDelay: number;
			closeDelay: number;
			onOpenChangeComplete: OnChangeFn<boolean>;
		}> {}

export class LinkPreviewRootState {
	static create(opts: LinkPreviewRootStateOpts) {
		return setLinkPreviewRoot(new LinkPreviewRootState(opts));
	}

	readonly opts: LinkPreviewRootStateOpts;

	hasSelection = $state(false);
	isPointerDownOnContent = $state(false);
	containsSelection = $state(false);
	contentNode = $state<HTMLElement | null>(null);
	contentMounted = $state(false);
	triggerNode = $state<HTMLElement | null>(null);
	domContext: DOMContext = new DOMContext(() => null);
	#openTimer = createEffectTimeout(() => {
		this.opts.open.current = true;
	}, () => this.opts.openDelay.current);
	#closeTimer = createEffectTimeout(() => {
		this.opts.open.current = false;
	}, () => this.opts.closeDelay.current);

	constructor(opts: LinkPreviewRootStateOpts) {
		this.opts = opts;

		$effect(() => {
			const isOpen = this.opts.open.current;
			return untrack(() => {
				if (!isOpen) {
					this.hasSelection = false;
					return;
				}
				if (!this.domContext) return;

				const handlePointerUp = () => {
					this.containsSelection = false;
					this.isPointerDownOnContent = false;

					setTimeout(() => {
						const isSelection = this.domContext.getDocument().getSelection()?.toString() !== '';

						if (isSelection) {
							this.hasSelection = true;
						} else {
							this.hasSelection = false;
						}
					}, 1);
				};

				const unsubListener = on(this.domContext.getDocument(), 'pointerup', handlePointerUp);

				if (!this.contentNode) return;
				const tabCandidates = getTabbableCandidates(this.contentNode);

				for (const candidate of tabCandidates) {
					candidate.setAttribute('tabindex', '-1');
				}

				return () => {
					unsubListener();
					this.hasSelection = false;
					this.isPointerDownOnContent = false;
				};
			});
		});
	}

	clearTimeout() {
		this.#openTimer.stop();
		this.#closeTimer.stop();
	}

	handleOpen() {
		this.clearTimeout();
		if (this.opts.open.current || this.opts.disabled.current) return;
		this.#openTimer.start();
	}

	immediateClose() {
		this.clearTimeout();
		this.opts.open.current = false;
	}

	handleClose() {
		this.clearTimeout();

		if (!this.isPointerDownOnContent && !this.hasSelection) {
			this.#closeTimer.start();
		}
	}
}

interface LinkPreviewTriggerStateOpts extends WithRefOpts {}

export class LinkPreviewTriggerState {
	static create(opts: LinkPreviewTriggerStateOpts) {
		return new LinkPreviewTriggerState(opts, getLinkPreviewRoot());
	}

	readonly opts: LinkPreviewTriggerStateOpts;
	readonly root: LinkPreviewRootState;
	readonly attachment: RefAttachment;

	constructor(opts: LinkPreviewTriggerStateOpts, root: LinkPreviewRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => (this.root.triggerNode = v));
		this.root.domContext = new DOMContext(opts.ref);
		this.onpointerenter = this.onpointerenter.bind(this);
		this.onpointerleave = this.onpointerleave.bind(this);
		this.onfocus = this.onfocus.bind(this);
		this.onblur = this.onblur.bind(this);
	}

	onpointerenter(e: BitsPointerEvent) {
		if (e.pointerType === 'touch') return;
		this.root.handleOpen();
	}

	onpointerleave(e: BitsPointerEvent) {
		if (e.pointerType === 'touch') return;
		if (!this.root.contentMounted || !this.root.opts.open.current) {
			this.root.immediateClose();
		}
	}

	onfocus(e: BitsFocusEvent) {
		if (!e.currentTarget.matches(':focus-visible')) return;
		this.root.handleOpen();
	}

	onblur(_: BitsFocusEvent) {
		this.root.handleClose();
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				'aria-haspopup': 'dialog',
				'aria-expanded': boolToStr(this.root.opts.open.current),
				'data-state': getDataOpenClosed(this.root.opts.open.current),
				'aria-controls': this.root.contentNode?.id,
				role: 'button',
				[linkPreviewAttrs.trigger]: '',
				onpointerenter: this.onpointerenter,
				onfocus: this.onfocus,
				onblur: this.onblur,
				onpointerleave: this.onpointerleave,
				...this.attachment,
			}) as const,
	);
}

interface LinkPreviewContentStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			onInteractOutside: (e: PointerEvent) => void;
			onEscapeKeydown: (e: KeyboardEvent) => void;
		}> {}

export class LinkPreviewContentState {
	static create(opts: LinkPreviewContentStateOpts) {
		return new LinkPreviewContentState(opts, getLinkPreviewRoot());
	}

	readonly opts: LinkPreviewContentStateOpts;
	readonly root: LinkPreviewRootState;
	readonly attachment: RefAttachment;

	constructor(opts: LinkPreviewContentStateOpts, root: LinkPreviewRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => (this.root.contentNode = v));
		this.root.domContext = new DOMContext(opts.ref);
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointerenter = this.onpointerenter.bind(this);
		this.onfocusout = this.onfocusout.bind(this);

		new SafePolygon({
			triggerNode: () => this.root.triggerNode,
			contentNode: () => this.opts.ref.current,
			enabled: () => this.root.opts.open.current,
			onPointerExit: () => {
				this.root.handleClose();
			},
		});

		onDestroy(() => {
			this.root.clearTimeout();
		});
	}

	onpointerdown(e: BitsPointerEvent) {
		const target = e.target;
		if (!isElement(target)) return;

		if (e.currentTarget.contains(target)) {
			this.root.containsSelection = true;
		}
		this.root.hasSelection = true;
		this.root.isPointerDownOnContent = true;
	}

	onpointerenter(e: BitsPointerEvent) {
		if (e.pointerType === 'touch') return;
		this.root.handleOpen();
	}

	onfocusout(e: BitsFocusEvent) {
		e.preventDefault();
	}

	onInteractOutside = (e: PointerEvent) => {
		this.opts.onInteractOutside.current(e);
		if (e.defaultPrevented) return;
		this.root.handleClose();
	};

	onEscapeKeydown = (e: KeyboardEvent) => {
		this.opts.onEscapeKeydown.current?.(e);
		if (e.defaultPrevented) return;
		this.root.handleClose();
	};

	readonly snippetProps = $derived.by(() => ({ open: this.root.opts.open.current }));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				tabindex: -1,
				'data-state': getDataOpenClosed(this.root.opts.open.current),
				[linkPreviewAttrs.content]: '',
				onpointerdown: this.onpointerdown,
				onpointerenter: this.onpointerenter,
				onfocusout: this.onfocusout,
				...this.attachment,
			}) as const,
	);
}
