import { attachRef, DOMContext } from '../../internal/tools/index.js';
import { on } from 'svelte/events';
import { createContext, onMount, untrack } from 'svelte';
import { isElement } from '../../internal/tools/utils/dom.js';
import { createBitsAttrs, boolToEmptyStrOrUndef } from '../../internal/attrs.js';
import type { OnChangeFn, RefAttachment, RefOpts } from '../../internal/types.js';
import type { FocusEventHandler, MouseEventHandler, PointerEventHandler } from 'svelte/elements';
import { createEffectTimeout } from '../../internal/timeout-fn.svelte.js';
import { SafePolygon } from '../../internal/safe-polygon.svelte.js';

export const tooltipAttrs = createBitsAttrs({
	component: 'tooltip',
	parts: ['content', 'trigger'],
});
const [getTooltipProvider, setTooltipProvider] = createContext<TooltipProviderState>();
const [getTooltipRoot, setTooltipRoot] = createContext<TooltipRootState>();

type TooltipTriggerRecord = {
	id: string;
	node: HTMLElement | null;
	payload: unknown;
	disabled: boolean;
};

class TooltipTriggerRegistryState {
	triggers = $state(new Map<string, TooltipTriggerRecord>());
	activeTriggerId = $state<string | null>(null);
	activeTriggerNode = $derived.by(() => {
		const activeTriggerId = this.activeTriggerId;
		if (activeTriggerId === null) return null;
		return this.triggers.get(activeTriggerId)?.node ?? null;
	});
	activePayload = $derived.by(() => {
		const activeTriggerId = this.activeTriggerId;
		if (activeTriggerId === null) return null;
		return this.triggers.get(activeTriggerId)?.payload ?? null;
	});

	register = (record: TooltipTriggerRecord) => {
		const next = new Map(this.triggers);
		next.set(record.id, record);
		this.triggers = next;
		this.#coerceActiveTrigger();
	};

	update = (record: TooltipTriggerRecord) => {
		const next = new Map(this.triggers);
		next.set(record.id, record);
		this.triggers = next;
		this.#coerceActiveTrigger();
	};

	unregister = (id: string) => {
		if (!this.triggers.has(id)) return;
		const next = new Map(this.triggers);
		next.delete(id);
		this.triggers = next;
		if (this.activeTriggerId === id) {
			this.activeTriggerId = null;
		}
	};

	setActiveTrigger = (id: string | null) => {
		if (id === null) {
			this.activeTriggerId = null;
			return;
		}
		if (!this.triggers.has(id)) {
			this.activeTriggerId = null;
			return;
		}
		this.activeTriggerId = id;
	};

	get = (id: string) => {
		return this.triggers.get(id);
	};

	has = (id: string) => {
		return this.triggers.has(id);
	};

	getFirstTriggerId = () => {
		const firstEntry = this.triggers.entries().next();
		if (firstEntry.done) return null;
		return firstEntry.value[0];
	};

	#coerceActiveTrigger = () => {
		const activeTriggerId = this.activeTriggerId;
		if (activeTriggerId === null) return;
		if (!this.triggers.has(activeTriggerId)) {
			this.activeTriggerId = null;
		}
	};
}

class TooltipTetherState {
	readonly registry = new TooltipTriggerRegistryState();
	root = $state<TooltipRootState | null>(null);
}

// oxlint-disable-next-line no-unused-vars
export class TooltipTether<Payload = never> {
	readonly #state = new TooltipTetherState();

	get state() {
		return this.#state;
	}

	open(triggerId: string) {
		if (!this.#state.registry.has(triggerId)) {
			return;
		}
		this.#state.registry.setActiveTrigger(triggerId);
		this.#state.root?.setActiveTrigger(triggerId);
		this.#state.root?.handleOpen();
	}

	close() {
		this.#state.root?.handleClose();
	}

	get isOpen() {
		return this.#state.root?.opts.open ?? false;
	}
}

export function createTooltipTether<Payload = never>() {
	return new TooltipTether<Payload>();
}

interface TooltipProviderStateOpts {
	readonly delayDuration: number;
	readonly disableHoverableContent: boolean;
	readonly disableCloseOnTriggerClick: boolean;
	readonly disabled: boolean;
	readonly ignoreNonKeyboardFocus: boolean;
	readonly skipDelayDuration: number;
}

export class TooltipProviderState {
	static create(opts: TooltipProviderStateOpts) {
		return setTooltipProvider(new TooltipProviderState(opts));
	}
	readonly opts: TooltipProviderStateOpts;
	isOpenDelayed = $state<boolean>(true);
	readonly #timerFn: ReturnType<typeof createEffectTimeout<() => void>>;
	#openTooltip = $state<TooltipRootState | null>(null);

	constructor(opts: TooltipProviderStateOpts) {
		this.opts = opts;
		this.#timerFn = createEffectTimeout(
			() => {
				this.isOpenDelayed = true;
			},
			() => this.opts.skipDelayDuration,
		);

		onMount(() =>
			on(window, 'scroll', (e) => {
				const activeTooltip = this.#openTooltip;
				if (!activeTooltip) return;
				const triggerNode = activeTooltip.triggerNode;
				if (!triggerNode) return;

				const target = e.target;
				if (!(target instanceof Element || target instanceof Document)) return;

				if (target.contains(triggerNode)) {
					activeTooltip.handleClose();
				}
			}),
		);
	}

	#startTimer = () => {
		const skipDuration = this.opts.skipDelayDuration;

		if (skipDuration === 0) {
			// no grace period — reset immediately so next trigger waits the full delay
			this.isOpenDelayed = true;
			return;
		} else {
			this.#timerFn.start();
		}
	};

	#clearTimer = () => {
		this.#timerFn.stop();
	};

	onOpen = (tooltip: TooltipRootState) => {
		if (this.#openTooltip && this.#openTooltip !== tooltip) {
			this.#openTooltip.handleClose();
		}

		this.#clearTimer();
		this.isOpenDelayed = false;
		this.#openTooltip = tooltip;
	};

	onClose = (tooltip: TooltipRootState) => {
		if (this.#openTooltip === tooltip) {
			this.#openTooltip = null;
			this.#startTimer();
		}
	};

	isTooltipOpen = (tooltip: TooltipRootState) => {
		return this.#openTooltip === tooltip;
	};
}

interface TooltipRootStateOpts {
	readonly delayDuration: number | undefined;
	readonly disableHoverableContent: boolean | undefined;
	readonly disableCloseOnTriggerClick: boolean | undefined;
	readonly disabled: boolean | undefined;
	readonly ignoreNonKeyboardFocus: boolean | undefined;
	readonly onOpenChangeComplete: OnChangeFn<boolean>;
	readonly tether: TooltipTether<unknown> | undefined;
	open: boolean;
	triggerId: string | null;
}

export class TooltipRootState {
	static create(opts: TooltipRootStateOpts) {
		return setTooltipRoot(new TooltipRootState(opts, getTooltipProvider()));
	}
	readonly opts: TooltipRootStateOpts;
	readonly provider: TooltipProviderState;
	readonly delayDuration = $derived.by(() => this.opts.delayDuration ?? this.provider.opts.delayDuration);
	readonly disableHoverableContent = $derived.by(
		() => this.opts.disableHoverableContent ?? this.provider.opts.disableHoverableContent,
	);
	readonly disableCloseOnTriggerClick = $derived.by(
		() => this.opts.disableCloseOnTriggerClick ?? this.provider.opts.disableCloseOnTriggerClick,
	);
	readonly disabled = $derived.by(() => this.opts.disabled ?? this.provider.opts.disabled);
	readonly ignoreNonKeyboardFocus = $derived.by(
		() => this.opts.ignoreNonKeyboardFocus ?? this.provider.opts.ignoreNonKeyboardFocus,
	);
	readonly registry: TooltipTriggerRegistryState;
	readonly tether: TooltipTetherState | null;
	contentNode = $state<HTMLElement | null>(null);
	#wasOpenDelayed = $state(false);
	readonly #timerFn: ReturnType<typeof createEffectTimeout<() => void>>;
	readonly stateAttr = $derived.by(() => {
		if (!this.opts.open) return 'closed';
		return this.#wasOpenDelayed ? 'delayed-open' : 'instant-open';
	});

	constructor(opts: TooltipRootStateOpts, provider: TooltipProviderState) {
		this.opts = opts;
		this.provider = provider;
		this.tether = opts.tether?.state ?? null;
		this.registry = this.tether?.registry ?? new TooltipTriggerRegistryState();
		this.#timerFn = createEffectTimeout(
			() => {
				this.#wasOpenDelayed = true;
				this.opts.open = true;
			},
			() => this.delayDuration ?? 0,
		);

		if (this.tether) {
			this.tether.root = this;
			onMount(() => {
				return () => {
					if (this.tether?.root === this) {
						this.tether.root = null;
					}
				};
			});
		}

		let openStarted = false;
		$effect(() => {
			const isOpen = this.opts.open;
			if (!openStarted) {
				openStarted = true;
				return;
			}
			untrack(() => {
				if (isOpen) {
					this.ensureActiveTrigger();
					this.provider.onOpen(this);
				} else {
					this.provider.onClose(this);
				}
			});
		});

		$effect(() => {
			const triggerId = this.opts.triggerId;
			untrack(() => {
				if (triggerId === this.registry.activeTriggerId) return;
				this.registry.setActiveTrigger(triggerId);
			});
		});

		$effect(() => {
			const activeTriggerId = this.registry.activeTriggerId;
			untrack(() => {
				if (this.opts.triggerId === activeTriggerId) return;
				this.opts.triggerId = activeTriggerId;
			});
		});
	}

	handleOpen = () => {
		this.#timerFn.stop();
		this.#wasOpenDelayed = false;
		this.ensureActiveTrigger();
		this.opts.open = true;
	};

	handleClose = () => {
		this.#timerFn.stop();
		this.opts.open = false;
	};

	#handleDelayedOpen = () => {
		this.#timerFn.stop();

		const shouldSkipDelay = !this.provider.isOpenDelayed;
		const delayDuration = this.delayDuration ?? 0;

		// if no delay needed (either skip delay active or delay is 0), open immediately
		if (shouldSkipDelay || delayDuration === 0) {
			this.#wasOpenDelayed = false;
			this.opts.open = true;
		} else {
			// use timer for actual delays
			this.#timerFn.start();
		}
	};

	onTriggerEnter = (triggerId: string) => {
		this.setActiveTrigger(triggerId);
		this.#handleDelayedOpen();
	};

	onTriggerLeave = () => {
		if (this.disableHoverableContent) {
			this.handleClose();
		} else {
			this.#timerFn.stop();
		}
	};

	ensureActiveTrigger = () => {
		if (this.registry.activeTriggerId !== null && this.registry.has(this.registry.activeTriggerId)) {
			return;
		}

		if (this.opts.triggerId !== null && this.registry.has(this.opts.triggerId)) {
			this.registry.setActiveTrigger(this.opts.triggerId);
			return;
		}

		const firstTriggerId = this.registry.getFirstTriggerId();
		this.registry.setActiveTrigger(firstTriggerId);
	};

	setActiveTrigger = (triggerId: string | null) => {
		this.registry.setActiveTrigger(triggerId);
	};

	registerTrigger = (trigger: TooltipTriggerRecord) => {
		this.registry.register(trigger);

		if (trigger.disabled && this.registry.activeTriggerId === trigger.id && this.opts.open) {
			this.handleClose();
		}
	};

	updateTrigger = (trigger: TooltipTriggerRecord) => {
		this.registry.update(trigger);

		if (trigger.disabled && this.registry.activeTriggerId === trigger.id && this.opts.open) {
			this.handleClose();
		}
	};

	unregisterTrigger = (id: string) => {
		const isActive = this.registry.activeTriggerId === id;
		this.registry.unregister(id);

		if (isActive && this.opts.open) {
			this.handleClose();
		}
	};

	isActiveTrigger = (triggerId: string) => {
		return this.registry.activeTriggerId === triggerId;
	};

	get triggerNode() {
		return this.registry.activeTriggerNode;
	}

	get activePayload() {
		return this.registry.activePayload;
	}

	get activeTriggerId() {
		return this.registry.activeTriggerId;
	}
}

interface TooltipTriggerStateOpts extends RefOpts {
	readonly disabled: boolean;
	readonly tabindex: number;
	readonly payload: unknown;
	readonly tether: TooltipTether<unknown> | undefined;
}

export class TooltipTriggerState {
	static create(opts: TooltipTriggerStateOpts) {
		const tether = opts.tether;
		if (tether) {
			return new TooltipTriggerState(opts, null, tether.state);
		}
		return new TooltipTriggerState(opts, getTooltipRoot(), null);
	}
	readonly opts: TooltipTriggerStateOpts;
	readonly root: TooltipRootState | null;
	readonly tether: TooltipTetherState | null;
	readonly attachment: RefAttachment;
	#isPointerDown = false;
	#hasPointerMoveOpened = $state(false);
	domContext: DOMContext;
	#mounted = false;
	#lastRegisteredId: string | null = null;

	constructor(opts: TooltipTriggerStateOpts, root: TooltipRootState | null, tether: TooltipTetherState | null) {
		this.opts = opts;
		this.root = root;
		this.tether = tether;
		this.domContext = new DOMContext(() => opts.ref);
		this.attachment = attachRef<HTMLElement>(
			(v) => (opts.ref = v),
			(v) => this.#register(v),
		);

		$effect(() => {
			const _id = this.opts.id;
			untrack(() => {
				this.#register(this.opts.ref);
			});
		});
		$effect(() => {
			const _payload = this.opts.payload;
			untrack(() => {
				this.#register(this.opts.ref);
			});
		});
		$effect(() => {
			const _disabled = this.opts.disabled;
			untrack(() => {
				this.#register(this.opts.ref);
			});
		});

		onMount(() => {
			this.#mounted = true;
			this.#register(this.opts.ref);

			return () => {
				const root = this.#getRoot();
				const id = this.#lastRegisteredId;
				if (id) {
					if (this.tether) {
						this.tether.registry.unregister(id);
					} else {
						root?.unregisterTrigger(id);
					}
				}
				this.#lastRegisteredId = null;
				this.#mounted = false;
			};
		});
	}

	#getRoot = () => {
		return this.tether?.root ?? this.root;
	};

	#isDisabled = () => {
		const root = this.#getRoot();
		return this.opts.disabled || Boolean(root?.disabled);
	};

	#register = (node: HTMLElement | null) => {
		if (!this.#mounted) return;
		const id = this.opts.id;
		const payload = this.opts.payload;
		const disabled = this.opts.disabled;

		if (this.#lastRegisteredId && this.#lastRegisteredId !== id) {
			const root = this.#getRoot();
			if (this.tether) {
				this.tether.registry.unregister(this.#lastRegisteredId);
			} else {
				root?.unregisterTrigger(this.#lastRegisteredId);
			}
		}

		const triggerRecord: TooltipTriggerRecord = {
			id,
			node,
			payload,
			disabled,
		};

		const root = this.#getRoot();
		if (this.tether) {
			if (this.tether.registry.has(id)) {
				this.tether.registry.update(triggerRecord);
			} else {
				this.tether.registry.register(triggerRecord);
			}

			if (disabled && this.tether.registry.activeTriggerId === id && root?.opts.open) {
				root.handleClose();
			}
		} else {
			if (root?.registry.has(id)) {
				root.updateTrigger(triggerRecord);
			} else {
				root?.registerTrigger(triggerRecord);
			}
		}

		this.#lastRegisteredId = id;
	};

	handlePointerUp = () => {
		this.#isPointerDown = false;
	};

	#onpointerup: PointerEventHandler<HTMLElement> = () => {
		if (this.#isDisabled()) return;
		this.#isPointerDown = false;
	};

	#onpointerdown: PointerEventHandler<HTMLElement> = () => {
		if (this.#isDisabled()) return;
		this.#isPointerDown = true;

		on(
			this.domContext.getDocument(),
			'pointerup',
			() => {
				this.handlePointerUp();
			},
			{ once: true },
		);
	};

	#onpointerenter: PointerEventHandler<HTMLElement> = (e) => {
		const root = this.#getRoot();
		if (!root) return;
		if (this.#isDisabled()) {
			if (root.opts.open) {
				root.handleClose();
			}
			return;
		}
		if (e.pointerType === 'touch') return;

		root.onTriggerEnter(this.opts.id);
		this.#hasPointerMoveOpened = true;
	};

	#onpointermove: PointerEventHandler<HTMLElement> = (e) => {
		const root = this.#getRoot();
		if (!root) return;
		if (this.#isDisabled()) {
			if (root.opts.open) {
				root.handleClose();
			}
			return;
		}
		if (e.pointerType === 'touch') return;
		if (this.#hasPointerMoveOpened) return;

		root.onTriggerEnter(this.opts.id);
		this.#hasPointerMoveOpened = true;
	};

	#onpointerleave: PointerEventHandler<HTMLElement> = (e) => {
		const root = this.#getRoot();
		if (!root) return;
		if (this.#isDisabled()) return;
		if (!root.isActiveTrigger(this.opts.id)) {
			this.#hasPointerMoveOpened = false;
			return;
		}
		const relatedTarget = e.relatedTarget;

		// when moving to a sibling trigger and skip delay is active, don't close —
		// the sibling's enter handler will switch the active trigger instantly.
		// if skipDelayDuration is 0 there's no grace period, so close now and let
		// the sibling wait through the full delay (and re-animate).
		if (isElement(relatedTarget)) {
			for (const record of root.registry.triggers.values()) {
				if (record.node !== relatedTarget) continue;
				if (root.provider.opts.skipDelayDuration > 0) {
					this.#hasPointerMoveOpened = false;
					return;
				}
				root.handleClose();
				this.#hasPointerMoveOpened = false;
				return;
			}
		}

		root.onTriggerLeave();
		this.#hasPointerMoveOpened = false;
	};

	#onfocus: FocusEventHandler<HTMLElement> = (e) => {
		const root = this.#getRoot();
		if (!root) return;
		if (this.#isPointerDown) return;
		if (this.#isDisabled()) {
			if (root.opts.open) {
				root.handleClose();
			}
			return;
		}

		if (root.ignoreNonKeyboardFocus && !e.currentTarget.matches(':focus-visible')) return;
		root.setActiveTrigger(this.opts.id);
		root.handleOpen();
	};

	#onblur: FocusEventHandler<HTMLElement> = () => {
		const root = this.#getRoot();
		if (!root || this.#isDisabled()) return;
		root.handleClose();
	};

	#onclick: MouseEventHandler<HTMLElement> = () => {
		const root = this.#getRoot();
		if (!root || root.disableCloseOnTriggerClick || this.#isDisabled()) return;
		root.handleClose();
	};

	readonly props = $derived.by(() => {
		const root = this.#getRoot();
		const isOpenForTrigger = Boolean(root?.opts.open && root.isActiveTrigger(this.opts.id));
		const isDisabled = this.#isDisabled();

		return {
			id: this.opts.id,
			'aria-describedby': isOpenForTrigger ? root?.contentNode?.id : undefined,
			'data-state': isOpenForTrigger ? root?.stateAttr : 'closed',
			'data-disabled': boolToEmptyStrOrUndef(isDisabled),
			'data-delay-duration': `${root?.delayDuration ?? 0}`,
			[tooltipAttrs.trigger]: '',
			tabindex: isDisabled ? undefined : this.opts.tabindex,
			disabled: this.opts.disabled,
			onpointerup: this.#onpointerup,
			onpointerdown: this.#onpointerdown,
			onpointerenter: this.#onpointerenter,
			onpointermove: this.#onpointermove,
			onpointerleave: this.#onpointerleave,
			onfocus: this.#onfocus,
			onblur: this.#onblur,
			onclick: this.#onclick,
			...this.attachment,
		} as const;
	});
}

interface TooltipContentStateOpts extends RefOpts {
	readonly onInteractOutside: (e: PointerEvent) => void;
	readonly onEscapeKeydown: (e: KeyboardEvent) => void;
}

export class TooltipContentState {
	static create(opts: TooltipContentStateOpts) {
		return new TooltipContentState(opts, getTooltipRoot());
	}
	readonly opts: TooltipContentStateOpts;
	readonly root: TooltipRootState;
	readonly attachment: RefAttachment;
	constructor(opts: TooltipContentStateOpts, root: TooltipRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef<HTMLElement>(
			(v) => (opts.ref = v),
			(v) => (this.root.contentNode = v),
		);

		new SafePolygon({
			triggerNode: () => this.root.triggerNode,
			contentNode: () => this.root.contentNode,
			enabled: () => this.root.opts.open && !this.root.disableHoverableContent,
			transitIntentTimeout: 180,
			ignoredTargets: () => {
				// only skip closing for sibling triggers when there's a skip-delay grace period;
				// with skipDelayDuration=0 the close+reopen is intentional (full delay + re-animation)
				if (this.root.provider.opts.skipDelayDuration === 0) return [];
				const nodes: HTMLElement[] = [];
				const activeTriggerNode = this.root.triggerNode;
				for (const record of this.root.registry.triggers.values()) {
					if (record.node && record.node !== activeTriggerNode) {
						nodes.push(record.node);
					}
				}
				return nodes;
			},
			onPointerExit: () => {
				if (this.root.provider.isTooltipOpen(this.root)) {
					this.root.handleClose();
				}
			},
		});
	}

	onInteractOutside = (e: PointerEvent) => {
		if (isElement(e.target) && this.root.triggerNode?.contains(e.target) && this.root.disableCloseOnTriggerClick) {
			e.preventDefault();
			return;
		}
		this.opts.onInteractOutside(e);
		if (e.defaultPrevented) return;
		this.root.handleClose();
	};

	onEscapeKeydown = (e: KeyboardEvent) => {
		this.opts.onEscapeKeydown?.(e);
		if (e.defaultPrevented) return;
		this.root.handleClose();
	};

	onOpenAutoFocus = (e: Event) => {
		e.preventDefault();
	};

	onCloseAutoFocus = (e: Event) => {
		e.preventDefault();
	};

	readonly snippetProps = $derived.by(() => ({ open: this.root.opts.open }));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id,
				'data-state': this.root.stateAttr,
				'data-disabled': boolToEmptyStrOrUndef(this.root.disabled),
				style: {
					outline: 'none',
				},
				[tooltipAttrs.content]: '',
				...this.attachment,
			}) as const,
	);

	readonly popperProps = {
		onInteractOutside: this.onInteractOutside,
		onEscapeKeydown: this.onEscapeKeydown,
		onOpenAutoFocus: this.onOpenAutoFocus,
		onCloseAutoFocus: this.onCloseAutoFocus,
	};
}
