import { createContext, tick } from 'svelte';
import { on } from 'svelte/events';
import { attachRef, type RefAttachment } from '$lib/vendor/attach-ref';
import { Presence } from '$lib/vendor/presence.svelte';
import { createBitsAttrs } from '$lib/vendor/attrs';
import { kbd } from '$lib/vendor/kbd';
import type { ReadableProps, WithRefProps, WritableProps } from '$lib/vendor/utils';
import type { BitsKeyboardEvent, BitsMouseEvent, OnChangeFn } from '$lib/vendor/types';

const collapsibleAttrs = createBitsAttrs({
	component: 'collapsible',
	parts: ['root', 'content', 'trigger'],
});

interface CollapsibleRootStateOpts
	extends
		WithRefProps,
		WritableProps<{
			open: boolean;
		}>,
		ReadableProps<{
			disabled: boolean;
			onOpenChangeComplete: OnChangeFn<boolean>;
		}> {}

const [getCollapsibleRootContext, setCollapsibleRootContext] = createContext<CollapsibleRootState>();

export class CollapsibleRootState {
	static create(opts: CollapsibleRootStateOpts) {
		return setCollapsibleRootContext(new CollapsibleRootState(opts));
	}

	readonly opts: CollapsibleRootStateOpts;
	readonly attachment: RefAttachment;
	contentNode = $state<HTMLElement | null>(null);
	contentPresence: Presence;
	contentId = $state<string | undefined>(undefined);

	constructor(opts: CollapsibleRootStateOpts) {
		this.opts = opts;
		this.toggleOpen = this.toggleOpen.bind(this);
		this.attachment = attachRef<HTMLElement>((v) => (this.opts.ref.current = v));

		this.contentPresence = new Presence({
			open: () => this.opts.open.current,
			ref: () => this.contentNode,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			},
		});
	}

	toggleOpen() {
		this.opts.open.current = !this.opts.open.current;
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				'data-state': this.opts.open.current ? 'open' : 'closed',
				'data-disabled': this.opts.disabled.current ? '' : undefined,
				[collapsibleAttrs.root]: '',
				...this.attachment,
			}) as const,
	);
}

interface CollapsibleContentStateOpts
	extends
		WithRefProps,
		ReadableProps<{
			forceMount: boolean;
			hiddenUntilFound: boolean;
		}> {}

export class CollapsibleContentState {
	static create(opts: CollapsibleContentStateOpts) {
		return new CollapsibleContentState(opts, getCollapsibleRootContext());
	}

	readonly opts: CollapsibleContentStateOpts;
	readonly root: CollapsibleRootState;
	readonly attachment: RefAttachment;
	readonly present = $derived.by(() => {
		if (this.opts.hiddenUntilFound.current) return this.root.opts.open.current;
		return this.opts.forceMount.current || this.root.opts.open.current;
	});

	#originalStyles: { transitionDuration: string; animationName: string } | undefined;
	#isMountAnimationPrevented = $state(false);
	#width = $state(0);
	#height = $state(0);

	constructor(opts: CollapsibleContentStateOpts, root: CollapsibleRootState) {
		this.opts = opts;
		this.root = root;
		this.#isMountAnimationPrevented = root.opts.open.current;
		this.root.contentId = this.opts.id.current;
		this.attachment = attachRef<HTMLElement>(
			(v) => (this.opts.ref.current = v),
			(v) => (this.root.contentNode = v),
		);

		// runed watch.pre was non-lazy: keep contentId in sync, initial run included.
		$effect.pre(() => {
			this.root.contentId = this.opts.id.current;
		});

		$effect.pre(() => {
			const rAF = requestAnimationFrame(() => {
				this.#isMountAnimationPrevented = false;
			});
			return () => cancelAnimationFrame(rAF);
		});

		$effect.pre(() => {
			const node = this.opts.ref.current;
			const hiddenUntilFound = this.opts.hiddenUntilFound.current;
			if (!node || !hiddenUntilFound) return;

			const handleBeforeMatch = () => {
				if (this.root.opts.open.current) return;
				// defer opening until the browser finishes search highlighting,
				// otherwise it opens immediately and the highlight isn't visible
				requestAnimationFrame(() => {
					this.root.opts.open.current = true;
				});
			};

			return on(node, 'beforematch', handleBeforeMatch);
		});

		// re-measure whenever the node or presence changes
		$effect(() => {
			const node = this.opts.ref.current;
			void this.present;
			if (!node) return;
			tick().then(() => {
				if (!this.opts.ref.current) return;
				this.#originalStyles = this.#originalStyles || {
					transitionDuration: node.style.transitionDuration,
					animationName: node.style.animationName,
				};

				// block animations/transitions so the element renders at full dimensions
				node.style.transitionDuration = '0s';
				node.style.animationName = 'none';

				const rect = node.getBoundingClientRect();
				this.#height = rect.height;
				this.#width = rect.width;

				// restore the originals unless this is the initial render
				if (!this.#isMountAnimationPrevented) {
					const { animationName, transitionDuration } = this.#originalStyles;
					node.style.transitionDuration = transitionDuration;
					node.style.animationName = animationName;
				}
			});
		});
	}

	get shouldRender() {
		return this.root.contentPresence.shouldRender;
	}

	readonly snippetProps = $derived.by(() => ({
		open: this.root.opts.open.current,
	}));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				style: {
					'--bits-collapsible-content-height': this.#height ? `${this.#height}px` : undefined,
					'--bits-collapsible-content-width': this.#width ? `${this.#width}px` : undefined,
				},
				hidden: this.opts.hiddenUntilFound.current && !this.root.opts.open.current ? 'until-found' : undefined,
				'data-state': this.root.opts.open.current ? 'open' : 'closed',
				'data-starting-style': this.root.contentPresence.transitionStatus === 'starting' ? '' : undefined,
				'data-ending-style': this.root.contentPresence.transitionStatus === 'ending' ? '' : undefined,
				'data-disabled': this.root.opts.disabled.current ? '' : undefined,
				[collapsibleAttrs.content]: '',
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

interface CollapsibleTriggerStateOpts
	extends
		WithRefProps,
		ReadableProps<{
			disabled: boolean | null | undefined;
		}> {}

export class CollapsibleTriggerState {
	static create(opts: CollapsibleTriggerStateOpts) {
		return new CollapsibleTriggerState(opts, getCollapsibleRootContext());
	}

	readonly opts: CollapsibleTriggerStateOpts;
	readonly root: CollapsibleRootState;
	readonly attachment: RefAttachment;
	#isDisabled = $derived.by(() => this.opts.disabled.current || this.root.opts.disabled.current);

	constructor(opts: CollapsibleTriggerStateOpts, root: CollapsibleRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef<HTMLElement>((v) => (this.opts.ref.current = v));
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	onclick(e: BitsMouseEvent) {
		if (this.#isDisabled) return;
		if (e.button !== 0) return e.preventDefault();
		this.root.toggleOpen();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.#isDisabled) return;

		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.root.toggleOpen();
		}
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				type: 'button',
				disabled: this.#isDisabled,
				'aria-controls': this.root.contentId,
				'aria-expanded': this.root.opts.open.current ? 'true' : 'false',
				'data-state': this.root.opts.open.current ? 'open' : 'closed',
				'data-disabled': this.#isDisabled ? '' : undefined,
				[collapsibleAttrs.trigger]: '',
				//
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				...this.attachment,
			}) as const,
	);
}
