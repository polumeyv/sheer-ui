import { createContext, untrack } from 'svelte';
import {
	type ReadableBox,
	type ReadableBoxedValues,
	type WritableBoxedValues,
	attachRef,
	boxWith,
} from '../../internal/tools/index.js';
import { kbd } from '../../internal/kbd.js';
import { createBitsAttrs, boolToStr, getDataOpenClosed } from '../../internal/attrs.js';
import type {
	BitsFocusEvent,
	BitsKeyboardEvent,
	BitsMouseEvent,
	BitsPointerEvent,
	OnChangeFn,
	RefAttachment,
	WithRefOpts,
} from '../../internal/types.js';
import { isElement } from '../../internal/tools/utils/dom.js';
import type { Measurable } from '../../internal/floating-layer/index.js';
import { SafePolygon } from '../../internal/safe-polygon.svelte.js';
import { isTabbable } from '../../internal/tabbable.js';
import { createEffectTimeout } from '../../internal/timeout-fn.svelte.js';

const popoverAttrs = createBitsAttrs({
	component: 'popover',
	parts: ['root', 'trigger', 'content', 'close'],
});

const [getPopoverRoot, setPopoverRoot] = createContext<PopoverRootState>();

interface PopoverRootStateOpts
	extends
		WritableBoxedValues<{
			open: boolean;
		}>,
		ReadableBoxedValues<{
			onOpenChangeComplete: OnChangeFn<boolean>;
		}> {}

export class PopoverRootState {
	static create(opts: PopoverRootStateOpts) {
		return setPopoverRoot(new PopoverRootState(opts));
	}

	readonly opts: PopoverRootStateOpts;
	contentNode = $state<HTMLElement | null>(null);
	triggerNode = $state<HTMLElement | null>(null);

	// hover tracking state
	openedViaHover = $state(false);
	hasInteractedWithContent = $state(false);
	hoverCooldown = $state(false);
	#closeDelaySource = $state<ReadableBox<number>>(boxWith(() => 0));
	closeDelay = $derived.by(() => this.#closeDelaySource.current);
	#closeTimer = createEffectTimeout(() => {
		if (this.openedViaHover && !this.hasInteractedWithContent) {
			this.opts.open.current = false;
		}
	}, () => this.closeDelay);

	constructor(opts: PopoverRootStateOpts) {
		this.opts = opts;

		$effect(() => {
			const isOpen = this.opts.open.current;
			untrack(() => {
				if (!isOpen) {
					this.openedViaHover = false;
					this.hasInteractedWithContent = false;
					this.#closeTimer.stop();
				}
			});
		});
	}

	setCloseDelaySource(source: ReadableBox<number>) {
		this.#closeDelaySource = source;
	}

	toggleOpen() {
		this.#closeTimer.stop();
		this.opts.open.current = !this.opts.open.current;
	}

	handleClose() {
		this.#closeTimer.stop();
		if (!this.opts.open.current) return;
		this.opts.open.current = false;
	}

	handleHoverOpen() {
		this.#closeTimer.stop();
		if (this.opts.open.current) return;
		this.openedViaHover = true;
		this.opts.open.current = true;
	}

	handleHoverClose() {
		if (!this.opts.open.current) return;
		// only close if opened via hover and user hasn't interacted with content
		if (this.openedViaHover && !this.hasInteractedWithContent) {
			this.opts.open.current = false;
		}
	}

	handleDelayedHoverClose() {
		if (!this.opts.open.current) return;
		if (!this.openedViaHover || this.hasInteractedWithContent) return;

		if (this.closeDelay <= 0) {
			this.#closeTimer.stop();
			this.opts.open.current = false;
			return;
		}

		this.#closeTimer.start();
	}

	cancelDelayedClose() {
		this.#closeTimer.stop();
	}

	markInteraction() {
		this.hasInteractedWithContent = true;
		this.#closeTimer.stop();
	}
}

interface PopoverTriggerStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
			openOnHover: boolean;
			openDelay: number;
			closeDelay: number;
		}> {}

export class PopoverTriggerState {
	static create(opts: PopoverTriggerStateOpts) {
		return new PopoverTriggerState(opts, getPopoverRoot());
	}

	readonly opts: PopoverTriggerStateOpts;
	readonly root: PopoverRootState;
	readonly attachment: RefAttachment;

	#openTimer = createEffectTimeout(() => this.root.handleHoverOpen(), () => this.opts.openDelay.current);
	#isHovering = $state(false);
	#wasOpenOnPointerDown = false;

	constructor(opts: PopoverTriggerStateOpts, root: PopoverRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => (this.root.triggerNode = v));

		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointerenter = this.onpointerenter.bind(this);
		this.onpointerleave = this.onpointerleave.bind(this);

		this.root.setCloseDelaySource(this.opts.closeDelay);
	}

	onpointerenter(e: BitsPointerEvent) {
		if (this.opts.disabled.current) return;
		if (!this.opts.openOnHover.current) return;
		if (e.pointerType === 'touch') return;

		this.#isHovering = true;
		this.root.cancelDelayedClose();

		if (this.root.opts.open.current || this.root.hoverCooldown) return;

		if (this.opts.openDelay.current <= 0) {
			this.root.handleHoverOpen();
			return;
		}

		this.#openTimer.start();
	}

	onpointerleave(e: BitsPointerEvent) {
		if (this.opts.disabled.current) return;
		if (!this.opts.openOnHover.current) return;
		if (e.pointerType === 'touch') return;

		this.#isHovering = false;
		this.#openTimer.stop();
		this.root.hoverCooldown = false;

		// let GraceArea handle the close - it will call handleHoverClose via onPointerExit
		// we just need to stop any pending open timer
	}

	onpointerdown(_: BitsPointerEvent) {
		this.#wasOpenOnPointerDown = this.root.opts.open.current;
	}

	onclick(e: BitsMouseEvent) {
		if (this.opts.disabled.current) return;
		if (e.button !== 0) return;

		this.#openTimer.stop();

		// On engines without showPopover({source})'s invoker exemption, the UA light-dismisses the auto
		// popover at pointerdown — before this click — and the toggle below would instantly reopen it.
		if (this.#wasOpenOnPointerDown && !this.root.opts.open.current) {
			this.#wasOpenOnPointerDown = false;
			return;
		}

		// if clicked while hovering and popover is open, convert to click-based open
		if (this.#isHovering && this.root.opts.open.current && this.root.openedViaHover) {
			this.root.openedViaHover = false;
			this.root.hasInteractedWithContent = true;
			return;
		}

		// if closing while hovering with openOnHover enabled, set cooldown to prevent
		// immediate re-open via hover
		if (this.#isHovering && this.opts.openOnHover.current && this.root.opts.open.current) {
			this.root.hoverCooldown = true;
		}

		// if clicking to open while in cooldown, reset cooldown (explicit open)
		if (this.root.hoverCooldown && !this.root.opts.open.current) {
			this.root.hoverCooldown = false;
		}

		this.root.toggleOpen();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.opts.disabled.current) return;
		if (!(e.key === kbd.ENTER || e.key === kbd.SPACE)) return;
		e.preventDefault();
		this.#openTimer.stop();
		this.root.toggleOpen();
	}

	#getAriaControls(): string | undefined {
		if (this.root.opts.open.current && this.root.contentNode?.id) {
			return this.root.contentNode?.id;
		}
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				'aria-haspopup': 'dialog',
				'aria-expanded': boolToStr(this.root.opts.open.current),
				'data-state': getDataOpenClosed(this.root.opts.open.current),
				'aria-controls': this.#getAriaControls(),
				[popoverAttrs.trigger]: '',
				disabled: this.opts.disabled.current,
				//
				onkeydown: this.onkeydown,
				onclick: this.onclick,
				onpointerdown: this.onpointerdown,
				onpointerenter: this.onpointerenter,
				onpointerleave: this.onpointerleave,
				...this.attachment,
			}) as const,
	);
}

interface PopoverContentStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			customAnchor: string | HTMLElement | null | Measurable;
		}> {}

export class PopoverContentState {
	static create(opts: PopoverContentStateOpts) {
		return new PopoverContentState(opts, getPopoverRoot());
	}

	readonly opts: PopoverContentStateOpts;
	readonly root: PopoverRootState;
	readonly attachment: RefAttachment;

	constructor(opts: PopoverContentStateOpts, root: PopoverRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => (this.root.contentNode = v));

		this.onpointerdown = this.onpointerdown.bind(this);
		this.onfocusin = this.onfocusin.bind(this);
		this.onpointerenter = this.onpointerenter.bind(this);
		this.onpointerleave = this.onpointerleave.bind(this);

		new SafePolygon({
			triggerNode: () => this.root.triggerNode,
			contentNode: () => this.root.contentNode,
			enabled: () => this.root.opts.open.current && this.root.openedViaHover && !this.root.hasInteractedWithContent,
			onPointerExit: () => {
				this.root.handleDelayedHoverClose();
			},
		});
	}

	onpointerdown(_: BitsPointerEvent) {
		this.root.markInteraction();
	}

	onfocusin(e: BitsFocusEvent) {
		const target = e.target;
		if (isElement(target) && isTabbable(target)) {
			this.root.markInteraction();
		}
	}

	onpointerenter(e: BitsPointerEvent) {
		if (e.pointerType === 'touch') return;
		this.root.cancelDelayedClose();
	}

	onpointerleave(e: BitsPointerEvent) {
		if (e.pointerType === 'touch') return;
		// handled by grace area
	}

	// The UA owns dismissal (`popover="auto"` light dismiss + Escape); this is how state follows.
	dismiss = () => {
		this.root.handleClose();
	};

	readonly snippetProps = $derived.by(() => ({ open: this.root.opts.open.current }));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				tabindex: -1,
				'data-state': getDataOpenClosed(this.root.opts.open.current),
				[popoverAttrs.content]: '',
				onpointerdown: this.onpointerdown,
				onfocusin: this.onfocusin,
				onpointerenter: this.onpointerenter,
				onpointerleave: this.onpointerleave,
				...this.attachment,
			}) as const,
	);
}

interface PopoverCloseStateOpts extends WithRefOpts {}

export class PopoverCloseState {
	static create(opts: PopoverCloseStateOpts) {
		return new PopoverCloseState(opts, getPopoverRoot());
	}

	readonly opts: PopoverCloseStateOpts;
	readonly root: PopoverRootState;
	readonly attachment: RefAttachment;

	constructor(opts: PopoverCloseStateOpts, root: PopoverRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	onclick(_: BitsPointerEvent) {
		this.root.handleClose();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (!(e.key === kbd.ENTER || e.key === kbd.SPACE)) return;
		e.preventDefault();
		this.root.handleClose();
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				type: 'button',
				[popoverAttrs.close]: '',
				...this.attachment,
			}) as const,
	);
}
