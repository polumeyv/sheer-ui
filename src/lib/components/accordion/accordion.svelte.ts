import { attachRef, boxWith, type Box, type ReadableBoxedValues, type WritableBoxedValues } from '$lib/internal/tools/index.js';
import { createContext, tick } from 'svelte';
import type { BitsKeyboardEvent, BitsMouseEvent, RefAttachment, WithRefOpts } from '$lib/internal/types.js';
import { boolToStr, boolToEmptyStrOrUndef, getDataOpenClosed, getDataTransitionAttrs } from '$lib/internal/attrs.js';
import { kbd } from '$lib/internal/kbd.js';
import type { Orientation } from '$lib/internal/index.js';
import { createBitsAttrs } from '$lib/internal/attrs.js';
import { RovingFocusGroup } from '$lib/internal/roving-focus-group.js';
import { on } from 'svelte/events';
import { PresenceManager } from '$lib/internal/presence-manager.svelte.js';
import { createAttachmentKey, type Attachment } from 'svelte/attachments';

const accordionAttrs = createBitsAttrs({
	component: 'accordion',
	parts: ['root', 'trigger', 'content', 'item', 'header'],
});

const [getAccordionRoot, setAccordionRoot] = createContext<AccordionRoot>();
const [getAccordionItem, setAccordionItem] = createContext<AccordionItemState>();

interface AccordionBaseStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
			orientation: Orientation;
			loop: boolean;
		}> {}

interface AccordionSingleStateOpts extends AccordionBaseStateOpts, WritableBoxedValues<{ value: string }> {}
interface AccordionMultiStateOpts extends AccordionBaseStateOpts, WritableBoxedValues<{ value: string[] }> {}

type AccordionRoot = AccordionSingleState | AccordionMultiState;

interface AccordionItemStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			value: string;
			disabled: boolean;
		}> {
	rootState: AccordionRoot;
}

interface AccordionTriggerStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean | null | undefined;
			tabindex: number;
		}> {}

interface AccordionContentStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			forceMount: boolean;
			hiddenUntilFound: boolean;
		}> {}

interface AccordionHeaderStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			level: 1 | 2 | 3 | 4 | 5 | 6;
		}> {}

interface AccordionRootStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
			orientation: Orientation;
			loop: boolean;
		}> {
	type: 'single' | 'multiple';
	value: Box<string> | Box<string[]>;
}

abstract class AccordionBaseState {
	readonly opts: AccordionBaseStateOpts;
	readonly rovingFocusGroup: RovingFocusGroup;
	abstract readonly isMulti: boolean;
	readonly attachment: RefAttachment;

	constructor(opts: AccordionBaseStateOpts) {
		this.opts = opts;
		this.rovingFocusGroup = new RovingFocusGroup({
			rootNode: this.opts.ref,
			candidateAttr: accordionAttrs.trigger,
			loop: this.opts.loop,
			orientation: this.opts.orientation,
		});

		this.attachment = attachRef(this.opts.ref);
	}

	abstract includesItem(item: string): boolean;
	abstract toggleItem(item: string): void;

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				'data-orientation': this.opts.orientation.current,
				'data-disabled': boolToEmptyStrOrUndef(this.opts.disabled.current),
				[accordionAttrs.root]: '',
				...this.attachment,
			}) as const,
	);
}

class AccordionSingleState extends AccordionBaseState {
	readonly opts: AccordionSingleStateOpts;
	readonly isMulti = false as const;

	constructor(opts: AccordionSingleStateOpts) {
		super(opts);
		this.opts = opts;
		this.includesItem = this.includesItem.bind(this);
		this.toggleItem = this.toggleItem.bind(this);
	}

	includesItem(item: string): boolean {
		return this.opts.value.current === item;
	}

	toggleItem(item: string): void {
		this.opts.value.current = this.includesItem(item) ? '' : item;
	}
}

class AccordionMultiState extends AccordionBaseState {
	readonly #value: AccordionMultiStateOpts['value'];
	readonly isMulti = true as const;

	constructor(props: AccordionMultiStateOpts) {
		super(props);
		this.#value = props.value;
		this.includesItem = this.includesItem.bind(this);
		this.toggleItem = this.toggleItem.bind(this);
	}

	includesItem(item: string): boolean {
		return this.#value.current.includes(item);
	}

	toggleItem(item: string): void {
		this.#value.current = this.includesItem(item) ? this.#value.current.filter((v) => v !== item) : [...this.#value.current, item];
	}
}

export class AccordionRootState {
	static create(props: AccordionRootStateOpts): AccordionRoot {
		const { type, ...rest } = props;
		const rootState =
			type === 'single'
				? new AccordionSingleState(rest as AccordionSingleStateOpts)
				: new AccordionMultiState(rest as AccordionMultiStateOpts);
		return setAccordionRoot(rootState);
	}
}

export class AccordionItemState {
	static create(props: Omit<AccordionItemStateOpts, 'rootState'>): AccordionItemState {
		return setAccordionItem(new AccordionItemState({ ...props, rootState: getAccordionRoot() }));
	}

	readonly opts: AccordionItemStateOpts;
	readonly root: AccordionRoot;
	readonly isActive = $derived.by(() => this.root.includesItem(this.opts.value.current));
	readonly isDisabled = $derived.by(() => this.opts.disabled.current || this.root.opts.disabled.current);
	readonly attachment: RefAttachment;
	contentNode = $state<HTMLElement | null>(null);
	contentPresence: PresenceManager;

	constructor(opts: AccordionItemStateOpts) {
		this.opts = opts;
		this.root = opts.rootState;
		this.updateValue = this.updateValue.bind(this);
		this.attachment = attachRef(this.opts.ref);

		this.contentPresence = new PresenceManager({
			ref: boxWith(() => this.contentNode),
			open: boxWith(() => this.isActive),
		});
	}

	updateValue(): void {
		this.root.toggleItem(this.opts.value.current);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				'data-state': getDataOpenClosed(this.isActive),
				'data-disabled': boolToEmptyStrOrUndef(this.isDisabled),
				'data-orientation': this.root.opts.orientation.current,
				[accordionAttrs.item]: '',
				...this.attachment,
			}) as const,
	);
}

export class AccordionTriggerState {
	readonly opts: AccordionTriggerStateOpts;
	readonly itemState: AccordionItemState;
	readonly #root: AccordionRoot;
	readonly #isDisabled = $derived.by(
		() => this.opts.disabled.current || this.itemState.opts.disabled.current || this.#root.opts.disabled.current,
	);
	readonly attachment: RefAttachment;

	constructor(opts: AccordionTriggerStateOpts, itemState: AccordionItemState) {
		this.opts = opts;
		this.itemState = itemState;
		this.#root = itemState.root;
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
		this.attachment = attachRef(this.opts.ref);
	}

	static create(props: AccordionTriggerStateOpts): AccordionTriggerState {
		return new AccordionTriggerState(props, getAccordionItem());
	}

	onclick(e: BitsMouseEvent): void {
		if (this.#isDisabled || e.button !== 0) {
			e.preventDefault();
			return;
		}
		this.itemState.updateValue();
	}

	onkeydown(e: BitsKeyboardEvent): void {
		if (this.#isDisabled) return;

		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.itemState.updateValue();
			return;
		}

		this.#root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				disabled: this.#isDisabled,
				'aria-expanded': boolToStr(this.itemState.isActive),
				'aria-disabled': boolToStr(this.#isDisabled),
				'data-disabled': boolToEmptyStrOrUndef(this.#isDisabled),
				'data-state': getDataOpenClosed(this.itemState.isActive),
				'data-orientation': this.#root.opts.orientation.current,
				[accordionAttrs.trigger]: '',
				tabindex: this.opts.tabindex.current,
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				...this.attachment,
			}) as const,
	);
}

export class AccordionContentState {
	readonly opts: AccordionContentStateOpts;
	readonly item: AccordionItemState;
	readonly attachment: RefAttachment;
	#originalStyles: { transitionDuration: string; animationName: string } | undefined;
	#isMountAnimationPrevented = $state(false);
	#dimensions = $state({ width: 0, height: 0 });

	readonly open = $derived.by(() => {
		if (this.opts.hiddenUntilFound.current) return this.item.isActive;
		return this.opts.forceMount.current || this.item.isActive;
	});

	constructor(opts: AccordionContentStateOpts, item: AccordionItemState) {
		this.opts = opts;
		this.item = item;
		this.#isMountAnimationPrevented = this.item.isActive;
		this.attachment = {
			...attachRef(this.opts.ref, (v) => (this.item.contentNode = v)),
			[createAttachmentKey()]: ((node) => this.#attachBeforeMatch(node)) satisfies Attachment<HTMLElement>,
		};

		$effect(() => {
			const frame = requestAnimationFrame(() => {
				this.#isMountAnimationPrevented = false;
			});

			return () => cancelAnimationFrame(frame);
		});

		$effect(() => {
			const node = this.opts.ref.current;
			const open = this.open;
			if (!node) return;

			tick().then(() => {
				if (this.opts.ref.current !== node || this.open !== open) return;

				this.#originalStyles ??= {
					transitionDuration: node.style.transitionDuration,
					animationName: node.style.animationName,
				};

				node.style.transitionDuration = '0s';
				node.style.animationName = 'none';

				const rect = node.getBoundingClientRect();
				this.#dimensions = { width: rect.width, height: rect.height };

				if (!this.#isMountAnimationPrevented) {
					node.style.transitionDuration = this.#originalStyles.transitionDuration;
					node.style.animationName = this.#originalStyles.animationName;
				}
			});
		});
	}

	static create(props: AccordionContentStateOpts): AccordionContentState {
		return new AccordionContentState(props, getAccordionItem());
	}

	#attachBeforeMatch(node: HTMLElement) {
		if (!this.opts.hiddenUntilFound.current) return;
		return on(node, 'beforematch', () => {
			if (this.item.isActive) return;
			// we need to defer opening until after browser completes search highlighting
			// otherwise the browser will immediately open the accordion
			// and the search highlighting will not be visible
			requestAnimationFrame(() => {
				this.item.updateValue();
			});
		});
	}

	get shouldRender() {
		return this.item.contentPresence.shouldRender;
	}

	readonly snippetProps = $derived.by(() => ({ open: this.item.isActive }));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				'data-state': getDataOpenClosed(this.item.isActive),
				...getDataTransitionAttrs(this.item.contentPresence.transitionStatus),
				'data-disabled': boolToEmptyStrOrUndef(this.item.isDisabled),
				'data-orientation': this.item.root.opts.orientation.current,
				[accordionAttrs.content]: '',
				style: {
					'--bits-disclosure-content-height': `${this.#dimensions.height}px`,
					'--bits-disclosure-content-width': `${this.#dimensions.width}px`,
					'--bits-accordion-content-height': `${this.#dimensions.height}px`,
					'--bits-accordion-content-width': `${this.#dimensions.width}px`,
				},
				hidden: this.opts.hiddenUntilFound.current && !this.item.isActive ? 'until-found' : undefined,
				...(this.opts.hiddenUntilFound.current && !this.shouldRender
					? {}
					: {
							hidden: this.opts.hiddenUntilFound.current
								? !this.shouldRender
								: this.opts.forceMount.current
									? undefined
									: !this.shouldRender,
						}),
				...this.attachment,
			}) as const,
	);
}

export class AccordionHeaderState {
	readonly opts: AccordionHeaderStateOpts;
	readonly item: AccordionItemState;
	readonly attachment: RefAttachment;

	constructor(opts: AccordionHeaderStateOpts, item: AccordionItemState) {
		this.opts = opts;
		this.item = item;
		this.attachment = attachRef(this.opts.ref);
	}

	static create(props: AccordionHeaderStateOpts): AccordionHeaderState {
		return new AccordionHeaderState(props, getAccordionItem());
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: 'heading',
				'aria-level': this.opts.level.current,
				'data-heading-level': this.opts.level.current,
				'data-state': getDataOpenClosed(this.item.isActive),
				'data-orientation': this.item.root.opts.orientation.current,
				[accordionAttrs.header]: '',
				...this.attachment,
			}) as const,
	);
}
