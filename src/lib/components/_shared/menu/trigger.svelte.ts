import { untrack } from 'svelte';
import {
	attachRef,
	getWindow,
	writableProp,
	type ReadableProps,
	type RefAttachment,
} from '$lib/vendor/index';
import { isMouseEvent } from '$lib/components/_shared/menu/utils';
import type {
	BitsMouseEvent,
	BitsPointerEvent,
	WithRefProps,
} from '$lib/vendor/types';
import { kbd } from '$lib/vendor/kbd';
import type { KeyboardEventHandler, PointerEventHandler, MouseEventHandler } from 'svelte/elements';
import { CONTEXT_MENU_TRIGGER_ATTR } from '$lib/components/_shared/menu/attrs';
import { getMenuMenuContext } from '$lib/components/_shared/menu/context.svelte';
import type { MenuMenuState } from '$lib/components/_shared/menu/menu.svelte';

//
// DROPDOWN MENU TRIGGER
//

interface DropdownMenuTriggerStateOpts
	extends
		WithRefProps,
		ReadableProps<{
			disabled: boolean;
		}> {}

export class DropdownMenuTriggerState {
	static create(opts: DropdownMenuTriggerStateOpts) {
		return new DropdownMenuTriggerState(opts, getMenuMenuContext());
	}

	readonly opts: DropdownMenuTriggerStateOpts;
	readonly parentMenu: MenuMenuState;
	readonly attachment: RefAttachment;

	constructor(opts: DropdownMenuTriggerStateOpts, parentMenu: MenuMenuState) {
		this.opts = opts;
		this.parentMenu = parentMenu;
		this.attachment = attachRef(this.opts.ref, (v) => (this.parentMenu.triggerNode = v));
	}

	onclick: MouseEventHandler<HTMLElement> = (e) => {
		/**
		 * MacOS VoiceOver sends a click in Safari/Firefox bypassing the keydown event
		 * when V0+Space is pressed. Since we already handle the keydown event and the
		 * pointerdown events separately, we ignore it if the detail is not 0.
		 */
		if (this.opts.disabled.current || e.detail !== 0) return;
		this.parentMenu.toggleOpen();
		e.preventDefault();
	};

	onpointerdown: PointerEventHandler<HTMLElement> = (e) => {
		if (this.opts.disabled.current) return;
		if (e.pointerType === 'touch') return e.preventDefault();

		if (e.button === 0 && e.ctrlKey === false) {
			this.parentMenu.toggleOpen();
			// prevent trigger focusing when opening to allow
			// the content to be given focus without competition
			if (!this.parentMenu.opts.open.current) e.preventDefault();
		}
	};

	onpointerup: PointerEventHandler<HTMLElement> = (e) => {
		if (this.opts.disabled.current) return;
		if (e.pointerType === 'touch') {
			e.preventDefault();
			this.parentMenu.toggleOpen();
		}
	};

	onkeydown: KeyboardEventHandler<HTMLElement> = (e) => {
		if (this.opts.disabled.current) return;
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			this.parentMenu.toggleOpen();
			e.preventDefault();
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			this.parentMenu.onOpen();
			e.preventDefault();
		}
	};

	readonly #ariaControls = $derived.by(() => {
		if (this.parentMenu.opts.open.current && this.parentMenu.contentId.current) return this.parentMenu.contentId.current;
		return undefined;
	});

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				disabled: this.opts.disabled.current,
				'aria-haspopup': 'menu',
				'aria-expanded': this.parentMenu.opts.open.current ? 'true' : 'false',
				'aria-controls': this.#ariaControls,
				'data-disabled': this.opts.disabled.current ? '' : undefined,
				'data-state': this.parentMenu.opts.open.current ? 'open' : 'closed',
				[this.parentMenu.root.getBitsAttr('trigger')]: '',
				//
				onclick: this.onclick,
				onpointerdown: this.onpointerdown,
				onpointerup: this.onpointerup,
				onkeydown: this.onkeydown,
				...this.attachment,
			}) as const,
	);
}

interface ContextMenuTriggerStateOpts
	extends
		WithRefProps,
		ReadableProps<{
			disabled: boolean;
		}> {}

export class ContextMenuTriggerState {
	static create(opts: ContextMenuTriggerStateOpts) {
		return new ContextMenuTriggerState(opts, getMenuMenuContext());
	}

	readonly opts: ContextMenuTriggerStateOpts;
	readonly parentMenu: MenuMenuState;
	readonly attachment: RefAttachment;
	#point = $state({ x: 0, y: 0 });

	virtualElement = writableProp({
		getBoundingClientRect: () => DOMRect.fromRect({ width: 0, height: 0, ...this.#point }),
	});
	#longPressTimer: number | null = null;

	constructor(opts: ContextMenuTriggerStateOpts, parentMenu: MenuMenuState) {
		this.opts = opts;
		this.parentMenu = parentMenu;
		this.attachment = attachRef(this.opts.ref, (v) => (this.parentMenu.triggerNode = v));
		this.oncontextmenu = this.oncontextmenu.bind(this);
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
		this.onpointercancel = this.onpointercancel.bind(this);
		this.onpointerup = this.onpointerup.bind(this);

		$effect(() => {
			const point = this.#point;
			untrack(() => {
				this.virtualElement.current = {
					getBoundingClientRect: () => DOMRect.fromRect({ width: 0, height: 0, ...point }),
				};
			});
		});

		$effect(() => {
			const isDisabled = this.opts.disabled.current;
			untrack(() => {
				if (isDisabled) {
					this.#clearLongPressTimer();
				}
			});
		});

		$effect(() => () => this.#clearLongPressTimer());
	}

	#clearLongPressTimer() {
		if (this.#longPressTimer === null) return;
		getWindow(this.opts.ref.current).clearTimeout(this.#longPressTimer);
	}

	#handleOpen(e: BitsMouseEvent | BitsPointerEvent) {
		this.#point = { x: e.clientX, y: e.clientY };
		this.parentMenu.onOpen();
	}

	oncontextmenu(e: BitsMouseEvent) {
		if (e.defaultPrevented || this.opts.disabled.current) return;

		this.#clearLongPressTimer();
		this.#handleOpen(e);
		e.preventDefault();
		this.parentMenu.contentNode?.focus();
	}

	onpointerdown(e: BitsPointerEvent) {
		if (this.opts.disabled.current || isMouseEvent(e)) return;
		this.#clearLongPressTimer();
		this.#longPressTimer = getWindow(this.opts.ref.current).setTimeout(() => this.#handleOpen(e), 700);
	}

	onpointermove(e: BitsPointerEvent) {
		if (this.opts.disabled.current || isMouseEvent(e)) return;
		this.#clearLongPressTimer();
	}

	onpointercancel(e: BitsPointerEvent) {
		if (this.opts.disabled.current || isMouseEvent(e)) return;
		this.#clearLongPressTimer();
	}

	onpointerup(e: BitsPointerEvent) {
		if (this.opts.disabled.current || isMouseEvent(e)) return;
		this.#clearLongPressTimer();
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				disabled: this.opts.disabled.current,
				'data-disabled': this.opts.disabled.current ? '' : undefined,
				'data-state': this.parentMenu.opts.open.current ? 'open' : 'closed',
				[CONTEXT_MENU_TRIGGER_ATTR]: '',
				tabindex: -1,
				onpointerdown: this.onpointerdown,
				onpointermove: this.onpointermove,
				onpointercancel: this.onpointercancel,
				onpointerup: this.onpointerup,
				oncontextmenu: this.oncontextmenu,
				...this.attachment,
			}) as const,
	);
}
