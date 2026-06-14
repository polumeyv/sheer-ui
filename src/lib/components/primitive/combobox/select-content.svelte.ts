import { untrack, createContext } from 'svelte';
import { on } from 'svelte/events';
import { attachRef, DOMContext, type ReadableProps } from '$lib/vendor/index';
import type { BitsPointerEvent, WithRefProps, RefAttachment } from '$lib/vendor/types';
import { getFloatingContentCSSVars } from '$lib/vendor/floating-svelte/floating-utils.svelte';
import { getSelectRootContext, type SelectRoot, type SelectBaseRootState } from './select-root.svelte';

const [getSelectContentContext, setSelectContentContext] = createContext<SelectContentState>();

interface SelectContentStateOpts
	extends
		WithRefProps,
		ReadableProps<{
			onInteractOutside: (e: PointerEvent) => void;
			onEscapeKeydown: (e: KeyboardEvent) => void;
		}> {}

export class SelectContentState {
	static create(opts: SelectContentStateOpts) {
		return setSelectContentContext(new SelectContentState(opts, getSelectRootContext()));
	}
	readonly opts: SelectContentStateOpts;
	readonly root: SelectRoot;
	readonly attachment: RefAttachment;
	isPositioned = $state(false);
	domContext: DOMContext;

	constructor(opts: SelectContentStateOpts, root: SelectRoot) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref, (v) => (this.root.contentNode = v));
		this.domContext = new DOMContext(this.opts.ref);

		if (this.root.domContext === null) {
			this.root.domContext = this.domContext;
		}

		$effect(() => () => {
			this.root.contentNode = null;
			this.root.contentIsPositioned = false;
			this.isPositioned = false;
		});

		$effect(() => {
			void this.root.opts.open.current;
			untrack(() => {
				if (this.root.opts.open.current) return;
				this.root.contentIsPositioned = false;
				this.isPositioned = false;
			});
		});

		$effect(() => {
			void [this.isPositioned, this.root.highlightedNode];
			untrack(() => {
				if (!this.isPositioned || !this.root.highlightedNode) return;
				this.root.scrollHighlightedNodeIntoView(this.root.highlightedNode);
			});
		});

		this.onpointermove = this.onpointermove.bind(this);
	}

	onpointermove(_: BitsPointerEvent) {
		this.root.isUsingKeyboard = false;
	}

	readonly #styles = $derived.by(() => {
		return getFloatingContentCSSVars(this.root.isCombobox ? 'combobox' : 'select');
	});

	onInteractOutside = (e: PointerEvent) => {
		if (e.target === this.root.triggerNode || e.target === this.root.inputNode) {
			e.preventDefault();
			return;
		}
		this.opts.onInteractOutside.current(e);
		if (e.defaultPrevented) return;
		this.root.handleClose();
	};

	onEscapeKeydown = (e: KeyboardEvent) => {
		this.opts.onEscapeKeydown.current(e);
		if (e.defaultPrevented) return;
		this.root.handleClose();
	};

	onOpenAutoFocus = (e: Event) => {
		e.preventDefault();
	};

	onCloseAutoFocus = (e: Event) => {
		e.preventDefault();
	};

	get shouldRender() {
		return this.root.contentPresence.shouldRender;
	}

	readonly snippetProps = $derived.by(() => ({ open: this.root.opts.open.current }));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: 'listbox',
				'aria-multiselectable': this.root.isMulti ? 'true' : undefined,
				'data-state': this.root.opts.open.current ? 'open' : 'closed',
				...{
					'data-starting-style': this.root.contentPresence.transitionStatus === 'starting' ? '' : undefined,
					'data-ending-style': this.root.contentPresence.transitionStatus === 'ending' ? '' : undefined,
				},
				[this.root.getBitsAttr('content')]: '',
				style: {
					display: 'flex',
					flexDirection: 'column',
					outline: 'none',
					boxSizing: 'border-box',
					pointerEvents: 'auto',
					...this.#styles,
				},
				onpointermove: this.onpointermove,
				...this.attachment,
			}) as const,
	);

	readonly popperProps = {
		onInteractOutside: this.onInteractOutside,
		onEscapeKeydown: this.onEscapeKeydown,
		onOpenAutoFocus: this.onOpenAutoFocus,
		onCloseAutoFocus: this.onCloseAutoFocus,
		trapFocus: false,
		loop: false,
		onPlaced: () => {
			// onPlaced is also called when the menu is closed, so we need to check if the menu
			// is actually open to avoid setting positioning to true when the menu is closed
			if (this.root.opts.open.current) {
				this.root.contentIsPositioned = true;
				this.isPositioned = true;
			}
		},
	};
}

interface SelectViewportStateOpts extends WithRefProps {}

export class SelectViewportState {
	static create(opts: SelectViewportStateOpts) {
		return new SelectViewportState(opts, getSelectContentContext());
	}
	readonly opts: SelectViewportStateOpts;
	readonly content: SelectContentState;
	readonly root: SelectBaseRootState;
	readonly attachment: RefAttachment;
	prevScrollTop = $state(0);

	constructor(opts: SelectViewportStateOpts, content: SelectContentState) {
		this.opts = opts;
		this.content = content;
		this.root = content.root;
		this.attachment = attachRef(opts.ref, (v) => {
			this.root.viewportNode = v;
		});
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: 'presentation',
				[this.root.getBitsAttr('viewport')]: '',
				style: {
					// we use position: 'relative' here on the `viewport` so that when we call
					// `selectedItem.offsetTop` in calculations, the offset is relative to the viewport
					// (independent of the scrollUpButton).
					position: 'relative',
					flex: 1,
					overflow: 'auto',
				},
				...this.attachment,
			}) as const,
	);
}

interface SelectScrollButtonImplStateOpts
	extends
		WithRefProps,
		ReadableProps<{
			delay: (tick: number) => number;
		}> {}

export class SelectScrollButtonImplState {
	readonly opts: SelectScrollButtonImplStateOpts;
	readonly content: SelectContentState;
	readonly root: SelectBaseRootState;
	readonly attachment: RefAttachment;
	autoScrollTimer: number | null = null;
	userScrollTimer = -1;
	isUserScrolling = false;
	onAutoScroll: () => void = () => {};
	mounted = $state(false);

	constructor(opts: SelectScrollButtonImplStateOpts, content: SelectContentState) {
		this.opts = opts;
		this.content = content;
		this.root = content.root;
		this.attachment = attachRef(opts.ref);

		$effect(() => {
			void [this.mounted];
			untrack(() => {
				if (!this.mounted) {
					this.isUserScrolling = false;
					return;
				}
				if (this.isUserScrolling) return;
			});
		});

		$effect(() => {
			if (this.mounted) return;
			this.clearAutoScrollInterval();
		});

		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
		this.onpointerleave = this.onpointerleave.bind(this);
	}

	handleUserScroll() {
		this.content.domContext.clearTimeout(this.userScrollTimer);
		this.isUserScrolling = true;
		this.userScrollTimer = this.content.domContext.setTimeout(() => {
			this.isUserScrolling = false;
		}, 200);
	}

	clearAutoScrollInterval() {
		if (this.autoScrollTimer === null) return;
		this.content.domContext.clearTimeout(this.autoScrollTimer);
		this.autoScrollTimer = null;
	}

	onpointerdown(_: BitsPointerEvent) {
		if (this.autoScrollTimer !== null) return;
		const autoScroll = (tick: number) => {
			this.onAutoScroll();
			this.autoScrollTimer = this.content.domContext.setTimeout(() => autoScroll(tick + 1), this.opts.delay.current(tick));
		};
		this.autoScrollTimer = this.content.domContext.setTimeout(() => autoScroll(1), this.opts.delay.current(0));
	}

	onpointermove(e: BitsPointerEvent) {
		this.onpointerdown(e);
	}

	onpointerleave(_: BitsPointerEvent) {
		this.clearAutoScrollInterval();
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				'aria-hidden': true ? 'true' : undefined,
				style: {
					flexShrink: 0,
				},
				onpointerdown: this.onpointerdown,
				onpointermove: this.onpointermove,
				onpointerleave: this.onpointerleave,
				...this.attachment,
			}) as const,
	);
}

export class SelectScrollDownButtonState {
	static create(opts: SelectScrollButtonImplStateOpts) {
		return new SelectScrollDownButtonState(new SelectScrollButtonImplState(opts, getSelectContentContext()));
	}
	readonly scrollButtonState: SelectScrollButtonImplState;
	readonly content: SelectContentState;
	readonly root: SelectBaseRootState;
	canScrollDown = $state(false);
	scrollIntoViewTimer: ReturnType<typeof globalThis.setTimeout> | null = null;

	constructor(scrollButtonState: SelectScrollButtonImplState) {
		this.scrollButtonState = scrollButtonState;
		this.content = scrollButtonState.content;
		this.root = scrollButtonState.root;
		this.scrollButtonState.onAutoScroll = this.handleAutoScroll;

		$effect(() => {
			void [this.root.viewportNode, this.content.isPositioned];
			return untrack(() => {
				if (!this.root.viewportNode || !this.content.isPositioned) return;
				this.handleScroll(true);

				return on(this.root.viewportNode, 'scroll', () => this.handleScroll());
			});
		});

		/**
		 * If the input value changes, this means that the filtered items may have changed,
		 * so we need to re-evaluate the scroll-ability of the list.
		 */
		$effect(() => {
			void [this.root.opts.inputValue.current, this.root.viewportNode, this.content.isPositioned];
			untrack(() => {
				if (!this.root.viewportNode || !this.content.isPositioned) return;
				this.handleScroll(true);
			});
		});

		$effect(() => {
			void this.scrollButtonState.mounted;
			untrack(() => {
				if (!this.scrollButtonState.mounted) return;
				if (this.scrollIntoViewTimer) {
					clearTimeout(this.scrollIntoViewTimer);
				}
				this.scrollIntoViewTimer = setTimeout(() => {
					const activeItem = this.root.highlightedNode;
					if (!activeItem) return;
					this.root.scrollHighlightedNodeIntoView(activeItem);
				}, 5);
			});
		});
	}
	/**
	 * @param manual - if true, it means the function was invoked manually outside of an event
	 * listener, so we don't call `handleUserScroll` to prevent the auto scroll from kicking in.
	 */
	handleScroll = (manual = false) => {
		if (!manual) {
			this.scrollButtonState.handleUserScroll();
		}
		if (!this.root.viewportNode) return;
		const maxScroll = this.root.viewportNode.scrollHeight - this.root.viewportNode.clientHeight;
		const paddingTop = Number.parseInt(getComputedStyle(this.root.viewportNode).paddingTop, 10);

		this.canScrollDown = Math.ceil(this.root.viewportNode.scrollTop) < maxScroll - paddingTop;
	};

	handleAutoScroll = () => {
		const viewport = this.root.viewportNode;
		const selectedItem = this.root.highlightedNode;
		if (!viewport || !selectedItem) return;
		viewport.scrollTop = viewport.scrollTop + selectedItem.offsetHeight;
	};

	readonly props = $derived.by(
		() =>
			({
				...this.scrollButtonState.props,
				[this.root.getBitsAttr('scroll-down-button')]: '',
			}) as const,
	);
}

export class SelectScrollUpButtonState {
	static create(opts: SelectScrollButtonImplStateOpts) {
		return new SelectScrollUpButtonState(new SelectScrollButtonImplState(opts, getSelectContentContext()));
	}
	readonly scrollButtonState: SelectScrollButtonImplState;
	readonly content: SelectContentState;
	readonly root: SelectBaseRootState;
	canScrollUp = $state(false);

	constructor(scrollButtonState: SelectScrollButtonImplState) {
		this.scrollButtonState = scrollButtonState;
		this.content = scrollButtonState.content;
		this.root = scrollButtonState.root;
		this.scrollButtonState.onAutoScroll = this.handleAutoScroll;

		$effect(() => {
			void [this.root.viewportNode, this.content.isPositioned];
			return untrack(() => {
				if (!this.root.viewportNode || !this.content.isPositioned) return;

				this.handleScroll(true);
				return on(this.root.viewportNode, 'scroll', () => this.handleScroll());
			});
		});
	}

	/**
	 * @param manual - if true, it means the function was invoked manually outside of an event
	 * listener, so we don't call `handleUserScroll` to prevent the auto scroll from kicking in.
	 */
	handleScroll = (manual = false) => {
		if (!manual) {
			this.scrollButtonState.handleUserScroll();
		}
		if (!this.root.viewportNode) return;
		const paddingTop = Number.parseInt(getComputedStyle(this.root.viewportNode).paddingTop, 10);
		this.canScrollUp = this.root.viewportNode.scrollTop - paddingTop > 0.1;
	};

	handleAutoScroll = () => {
		if (!this.root.viewportNode || !this.root.highlightedNode) return;
		this.root.viewportNode.scrollTop = this.root.viewportNode.scrollTop - this.root.highlightedNode.offsetHeight;
	};

	readonly props = $derived.by(
		() =>
			({
				...this.scrollButtonState.props,
				[this.root.getBitsAttr('scroll-up-button')]: '',
			}) as const,
	);
}
