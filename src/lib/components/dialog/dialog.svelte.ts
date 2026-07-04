import { attachRef, boxWith, type ReadableBoxedValues, type WritableBoxedValues } from '../../internal/tools/index.js';
import { createContext, onDestroy, untrack } from 'svelte';
import { createBitsAttrs, boolToStr, getDataOpenClosed, boolToEmptyStrOrUndef, getDataTransitionAttrs } from '../../internal/attrs.js';
import type { BitsKeyboardEvent, BitsMouseEvent, OnChangeFn, RefAttachment, WithRefOpts } from '../../internal/types.js';
import { kbd } from '../../internal/kbd.js';
import { PresenceManager } from '../../internal/presence-manager.svelte.js';

type DialogVariant = 'alert-dialog' | 'dialog';

const dialogAttrs = createBitsAttrs({
	component: 'dialog',
	parts: ['content', 'trigger', 'overlay', 'title', 'description', 'close', 'cancel', 'action'],
});

const [getDialogRoot, setDialogRoot] = createContext<DialogRootState>();

const missingContextErrorUrl = 'https://svelte.dev/e/missing_context';

function getDialogRootOr<TFallback>(fallback: TFallback): DialogRootState | TFallback {
	try {
		return getDialogRoot();
	} catch (error) {
		if (error instanceof Error && error.message.includes(missingContextErrorUrl)) return fallback;
		throw error;
	}
}

interface DialogRootStateOpts
	extends
		WritableBoxedValues<{
			open: boolean;
		}>,
		ReadableBoxedValues<{
			variant: DialogVariant;
			onOpenChangeComplete: OnChangeFn<boolean>;
		}> {}

export class DialogRootState {
	static create(opts: DialogRootStateOpts) {
		const parent = getDialogRootOr(null);
		return setDialogRoot(new DialogRootState(opts, parent));
	}

	readonly opts: DialogRootStateOpts;
	triggerNode = $state<HTMLElement | null>(null);
	contentNode = $state<HTMLElement | null>(null);
	overlayNode = $state<HTMLElement | null>(null);
	descriptionNode = $state<HTMLElement | null>(null);
	contentId = $state<string | undefined>(undefined);
	triggerId = $state<string | undefined>(undefined);
	titleState = $state<DialogTitleState | null>(null);
	descriptionState = $state<DialogDescriptionState | null>(null);
	readonly titleId = $derived.by(() => this.titleState?.opts.id.current);
	readonly descriptionId = $derived.by(() => this.descriptionState?.opts.id.current);
	cancelNode = $state<HTMLElement | null>(null);
	nestedOpenCount = $state(0);
	readonly depth: number;
	readonly parent: DialogRootState | null;
	contentPresence: PresenceManager;
	overlayPresence: PresenceManager;

	constructor(opts: DialogRootStateOpts, parent: DialogRootState | null) {
		this.opts = opts;
		this.parent = parent;
		this.depth = parent ? parent.depth + 1 : 0;
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);

		this.contentPresence = new PresenceManager({
			ref: boxWith(() => this.contentNode),
			open: this.opts.open,
			enabled: true,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			},
		});

		this.overlayPresence = new PresenceManager({
			ref: boxWith(() => this.overlayNode),
			open: this.opts.open,
			enabled: true,
		});

		let started = false;
		$effect(() => {
			const isOpen = this.opts.open.current;
			if (!started) {
				started = true;
				return;
			}
			untrack(() => {
				if (!this.parent) return;
				if (isOpen) {
					this.parent.incrementNested();
				} else {
					this.parent.decrementNested();
				}
			});
		});

		onDestroy(() => {
			if (this.opts.open.current) {
				this.parent?.decrementNested();
			}
		});
	}

	handleOpen() {
		if (this.opts.open.current) return;
		this.opts.open.current = true;
	}

	handleClose() {
		if (!this.opts.open.current) return;
		this.opts.open.current = false;
	}

	getBitsAttr: typeof dialogAttrs.getAttr = (part) => {
		return dialogAttrs.getAttr(part, this.opts.variant.current);
	};

	incrementNested() {
		this.nestedOpenCount++;
		this.parent?.incrementNested();
	}

	decrementNested() {
		if (this.nestedOpenCount === 0) return;
		this.nestedOpenCount--;
		this.parent?.decrementNested();
	}

	readonly sharedProps = $derived.by(
		() =>
			({
				'data-state': getDataOpenClosed(this.opts.open.current),
			}) as const,
	);
}

interface DialogTriggerStateOpts extends WithRefOpts, ReadableBoxedValues<{ disabled: boolean }> {}

export class DialogTriggerState {
	static create(opts: DialogTriggerStateOpts) {
		return new DialogTriggerState(opts, getDialogRoot());
	}

	readonly opts: DialogTriggerStateOpts;
	readonly root: DialogRootState;
	readonly attachment: RefAttachment;

	constructor(opts: DialogTriggerStateOpts, root: DialogRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => {
			this.root.triggerNode = v;
			this.root.triggerId = v?.id;
		});
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	onclick(e: BitsMouseEvent) {
		if (this.opts.disabled.current) return;
		if (e.button > 0) return;
		this.root.handleOpen();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.opts.disabled.current) return;
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.root.handleOpen();
		}
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				'aria-haspopup': 'dialog',
				'aria-expanded': boolToStr(this.root.opts.open.current),
				'aria-controls': this.root.contentId,
				[this.root.getBitsAttr('trigger')]: '',
				onkeydown: this.onkeydown,
				onclick: this.onclick,
				disabled: this.opts.disabled.current ? true : undefined,
				...this.root.sharedProps,
				...this.attachment,
			}) as const,
	);
}

interface DialogCloseStateOpts extends WithRefOpts, ReadableBoxedValues<{ variant: 'action' | 'cancel' | 'close'; disabled: boolean }> {}

export class DialogCloseState {
	static create(opts: DialogCloseStateOpts) {
		return new DialogCloseState(opts, getDialogRoot());
	}

	readonly opts: DialogCloseStateOpts;
	readonly root: DialogRootState;
	readonly attachment: RefAttachment;

	constructor(opts: DialogCloseStateOpts, root: DialogRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	onclick(e: BitsMouseEvent) {
		if (this.opts.disabled.current) return;
		if (e.button > 0) return;
		this.root.handleClose();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.opts.disabled.current) return;
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.root.handleClose();
		}
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[this.root.getBitsAttr(this.opts.variant.current)]: '',
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				disabled: this.opts.disabled.current ? true : undefined,
				tabindex: 0,
				...this.root.sharedProps,
				...this.attachment,
			}) as const,
	);
}

interface DialogTitleStateOpts extends WithRefOpts, ReadableBoxedValues<{ level: 1 | 2 | 3 | 4 | 5 | 6 }> {}

export class DialogTitleState {
	static create(opts: DialogTitleStateOpts) {
		return new DialogTitleState(opts, getDialogRoot());
	}

	readonly opts: DialogTitleStateOpts;
	readonly root: DialogRootState;
	readonly attachment: RefAttachment;

	constructor(opts: DialogTitleStateOpts, root: DialogRootState) {
		this.opts = opts;
		this.root = root;
		this.root.titleState = this;
		this.attachment = attachRef(this.opts.ref);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: 'heading',
				'aria-level': this.opts.level.current,
				[this.root.getBitsAttr('title')]: '',
				...this.root.sharedProps,
				...this.attachment,
			}) as const,
	);
}

interface DialogDescriptionStateOpts extends WithRefOpts {}

export class DialogDescriptionState {
	static create(opts: DialogDescriptionStateOpts) {
		return new DialogDescriptionState(opts, getDialogRoot());
	}

	readonly opts: DialogDescriptionStateOpts;
	readonly root: DialogRootState;
	readonly attachment: RefAttachment;

	constructor(opts: DialogDescriptionStateOpts, root: DialogRootState) {
		this.opts = opts;
		this.root = root;
		this.root.descriptionState = this;
		this.attachment = attachRef(this.opts.ref, (v) => {
			this.root.descriptionNode = v;
		});
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[this.root.getBitsAttr('description')]: '',
				...this.root.sharedProps,
				...this.attachment,
			}) as const,
	);
}

interface DialogContentStateOpts extends WithRefOpts {}

export class DialogContentState {
	static create(opts: DialogContentStateOpts) {
		return new DialogContentState(opts, getDialogRoot());
	}

	readonly opts: DialogContentStateOpts;
	readonly root: DialogRootState;
	readonly attachment: RefAttachment;

	constructor(opts: DialogContentStateOpts, root: DialogRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => {
			this.root.contentNode = v;
			this.root.contentId = v?.id;
		});
	}

	readonly snippetProps = $derived.by(() => ({ open: this.root.opts.open.current }));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: this.root.opts.variant.current === 'alert-dialog' ? 'alertdialog' : 'dialog',
				'aria-modal': 'true',
				'aria-describedby': this.root.descriptionId,
				'aria-labelledby': this.root.titleId,
				[this.root.getBitsAttr('content')]: '',
				style: {
					pointerEvents: 'auto',
					outline: this.root.opts.variant.current === 'alert-dialog' ? 'none' : undefined,
					'--bits-dialog-depth': this.root.depth,
					'--bits-dialog-nested-count': this.root.nestedOpenCount,
					// CSS containment isolates style/layout calculations from the rest of the page,
					// improving performance when there's a large DOM behind the dialog.
					// Paint is omitted so tooltips/selects can render outside dialog bounds.
					contain: 'layout style',
				},
				tabindex: this.root.opts.variant.current === 'alert-dialog' ? -1 : undefined,
				'data-nested-open': boolToEmptyStrOrUndef(this.root.nestedOpenCount > 0),
				'data-nested': boolToEmptyStrOrUndef(this.root.parent !== null),
				...getDataTransitionAttrs(this.root.contentPresence.transitionStatus),
				...this.root.sharedProps,
				...this.attachment,
			}) as const,
	);

	get shouldRender() {
		return this.root.contentPresence.shouldRender;
	}
}

interface DialogOverlayStateOpts extends WithRefOpts {}

export class DialogOverlayState {
	static create(opts: DialogOverlayStateOpts) {
		return new DialogOverlayState(opts, getDialogRoot());
	}

	readonly opts: DialogOverlayStateOpts;
	readonly root: DialogRootState;
	readonly attachment: RefAttachment;
	constructor(opts: DialogOverlayStateOpts, root: DialogRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => (this.root.overlayNode = v));
	}

	readonly snippetProps = $derived.by(() => ({ open: this.root.opts.open.current }));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[this.root.getBitsAttr('overlay')]: '',
				style: {
					pointerEvents: 'auto',
					'--bits-dialog-depth': this.root.depth,
					'--bits-dialog-nested-count': this.root.nestedOpenCount,
				},
				'data-nested-open': boolToEmptyStrOrUndef(this.root.nestedOpenCount > 0),
				'data-nested': boolToEmptyStrOrUndef(this.root.parent !== null),
				...getDataTransitionAttrs(this.root.overlayPresence.transitionStatus),
				...this.root.sharedProps,
				...this.attachment,
			}) as const,
	);

	get shouldRender() {
		return this.root.overlayPresence.shouldRender;
	}
}
