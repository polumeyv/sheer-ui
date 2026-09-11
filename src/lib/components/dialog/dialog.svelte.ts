import { attachRef } from '../../internal/tools/index.js';
import { createContext, onDestroy, untrack } from 'svelte';
import { createBitsAttrs, boolToStr, getDataOpenClosed, boolToEmptyStrOrUndef } from '../../internal/attrs.js';
import type { BitsKeyboardEvent, BitsMouseEvent, OnChangeFn, RefAttachment, RefOpts } from '../../internal/types.js';
import { kbd } from '../../internal/kbd.js';
import { useOpenChangeComplete } from '../../internal/animations-settled.svelte.js';

type DialogVariant = 'alert-dialog' | 'dialog';

const dialogAttrs = createBitsAttrs({
	component: 'dialog',
	parts: ['content', 'trigger', 'overlay', 'title', 'description', 'close', 'cancel', 'action'],
});

const [getDialogRoot, setDialogRoot, hasDialogRoot] = createContext<DialogRootState>();

// The dialog's public state cell is the shared overlay OpenCell (internal/open-cell.svelte.ts),
// exported under its established dialog-facing name.
import { OpenCell as DialogState } from '../../internal/open-cell.svelte.js';
export { DialogState };

interface DialogRootStateOpts {
	readonly variant: DialogVariant;
	readonly onOpenChangeComplete: OnChangeFn<boolean>;
	open: boolean;
}

export class DialogRootState {
	static create(opts: DialogRootStateOpts) {
		const parent = hasDialogRoot() ? getDialogRoot() : null;
		return setDialogRoot(new DialogRootState(opts, parent));
	}

	readonly opts: DialogRootStateOpts;
	triggerNode = $state<HTMLElement | null>(null);
	contentNode = $state<HTMLElement | null>(null);
	descriptionNode = $state<HTMLElement | null>(null);
	contentId = $state<string | undefined>(undefined);
	triggerId = $state<string | undefined>(undefined);
	titleState = $state<DialogTitleState | null>(null);
	descriptionState = $state<DialogDescriptionState | null>(null);
	readonly titleId = $derived.by(() => this.titleState?.opts.id);
	readonly descriptionId = $derived.by(() => this.descriptionState?.opts.id);
	cancelNode = $state<HTMLElement | null>(null);
	nestedOpenCount = $state(0);
	readonly depth: number;
	readonly parent: DialogRootState | null;
	readonly #completion: { readonly pending: boolean };
	/** Rendered: open, or closing with the exit still settling — the window the headless content's scroll lock covers. */
	readonly present = $derived.by(() => this.opts.open || this.#completion.pending);

	constructor(opts: DialogRootStateOpts, parent: DialogRootState | null) {
		this.opts = opts;
		this.parent = parent;
		this.depth = parent ? parent.depth + 1 : 0;
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);

		this.#completion = useOpenChangeComplete(
			() => this.opts.open,
			() => this.contentNode,
			(isOpen) => this.opts.onOpenChangeComplete(isOpen),
		);

		let started = false;
		$effect(() => {
			const isOpen = this.opts.open;
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
			if (this.opts.open) {
				this.parent?.decrementNested();
			}
		});
	}

	handleOpen() {
		this.opts.open = true;
	}

	handleClose() {
		this.opts.open = false;
	}

	getBitsAttr: typeof dialogAttrs.getAttr = (part) => {
		return dialogAttrs.getAttr(part, this.opts.variant);
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
				'data-state': getDataOpenClosed(this.opts.open),
			}) as const,
	);
}

interface DialogTriggerStateOpts extends RefOpts {
	readonly disabled: boolean;
}

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
		this.attachment = attachRef<HTMLElement>(
			(v) => (opts.ref = v),
			(v) => {
				this.root.triggerNode = v;
				this.root.triggerId = v?.id;
			},
		);
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	onclick(e: BitsMouseEvent) {
		if (this.opts.disabled) return;
		if (e.button > 0) return;
		this.root.handleOpen();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.opts.disabled) return;
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.root.handleOpen();
		}
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id,
				'aria-haspopup': 'dialog',
				'aria-expanded': boolToStr(this.root.opts.open),
				'aria-controls': this.root.contentId,
				[this.root.getBitsAttr('trigger')]: '',
				onkeydown: this.onkeydown,
				onclick: this.onclick,
				disabled: this.opts.disabled ? true : undefined,
				...this.root.sharedProps,
				...this.attachment,
			}) as const,
	);
}

interface DialogCloseStateOpts extends RefOpts {
	readonly variant: 'action' | 'cancel' | 'close';
	readonly disabled: boolean;
}

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
		this.attachment = attachRef<HTMLElement>((v) => (opts.ref = v));
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	onclick(e: BitsMouseEvent) {
		if (this.opts.disabled) return;
		if (e.button > 0) return;
		this.root.handleClose();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.opts.disabled) return;
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.root.handleClose();
		}
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id,
				[this.root.getBitsAttr(this.opts.variant)]: '',
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				disabled: this.opts.disabled ? true : undefined,
				tabindex: 0,
				...this.root.sharedProps,
				...this.attachment,
			}) as const,
	);
}

interface DialogTitleStateOpts extends RefOpts {
	readonly level: 1 | 2 | 3 | 4 | 5 | 6;
}

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
		this.attachment = attachRef<HTMLElement>((v) => (opts.ref = v));
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id,
				role: 'heading',
				'aria-level': this.opts.level,
				[this.root.getBitsAttr('title')]: '',
				...this.root.sharedProps,
				...this.attachment,
			}) as const,
	);
}

interface DialogDescriptionStateOpts extends RefOpts {}

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
		this.attachment = attachRef<HTMLElement>(
			(v) => (opts.ref = v),
			(v) => {
				this.root.descriptionNode = v;
			},
		);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id,
				[this.root.getBitsAttr('description')]: '',
				...this.root.sharedProps,
				...this.attachment,
			}) as const,
	);
}

interface DialogContentStateOpts extends RefOpts {}

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
		this.attachment = attachRef<HTMLElement>(
			(v) => (opts.ref = v),
			(v) => {
				this.root.contentNode = v;
				this.root.contentId = v?.id;
			},
		);
	}

	readonly snippetProps = $derived.by(() => ({ open: this.root.opts.open }));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id,
				role: this.root.opts.variant === 'alert-dialog' ? 'alertdialog' : 'dialog',
				'aria-modal': 'true',
				'aria-describedby': this.root.descriptionId,
				'aria-labelledby': this.root.titleId,
				[this.root.getBitsAttr('content')]: '',
				style: {
					pointerEvents: 'auto',
					outline: this.root.opts.variant === 'alert-dialog' ? 'none' : undefined,
					'--bits-dialog-depth': this.root.depth,
					'--bits-dialog-nested-count': this.root.nestedOpenCount,
					// CSS containment isolates style/layout calculations from the rest of the page,
					// improving performance when there's a large DOM behind the dialog.
					// Paint is omitted so tooltips/selects can render outside dialog bounds.
					contain: 'layout style',
				},
				tabindex: this.root.opts.variant === 'alert-dialog' ? -1 : undefined,
				'data-nested-open': boolToEmptyStrOrUndef(this.root.nestedOpenCount > 0),
				'data-nested': boolToEmptyStrOrUndef(this.root.parent !== null),
				...this.root.sharedProps,
				...this.attachment,
			}) as const,
	);
}

interface DialogOverlayStateOpts extends RefOpts {}

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
		this.attachment = attachRef<HTMLElement>((v) => (opts.ref = v));
	}

	readonly snippetProps = $derived.by(() => ({ open: this.root.opts.open }));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id,
				[this.root.getBitsAttr('overlay')]: '',
				style: {
					pointerEvents: 'auto',
					'--bits-dialog-depth': this.root.depth,
					'--bits-dialog-nested-count': this.root.nestedOpenCount,
				},
				'data-nested-open': boolToEmptyStrOrUndef(this.root.nestedOpenCount > 0),
				'data-nested': boolToEmptyStrOrUndef(this.root.parent !== null),
				...this.root.sharedProps,
				...this.attachment,
			}) as const,
	);
}
