import { tick, untrack, createContext } from 'svelte';
import { attachRef, DOMContext, type ReadableProps, type WritableProps, type WritableProp } from '$lib/vendor/index';
import { on } from 'svelte/events';
import { backward, forward, next, prev } from '$lib/vendor/arrays';
import { kbd } from '$lib/vendor/kbd';
import type {
	BitsEvent,
	BitsFocusEvent,
	BitsKeyboardEvent,
	BitsMouseEvent,
	BitsPointerEvent,
	OnChangeFn,
	WithRefProps,
	RefAttachment,
} from '$lib/vendor/types';
import { isIOS } from '$lib/vendor/is';
import { DataTypeahead } from '$lib/vendor/data-typeahead.svelte';
import { DOMTypeahead } from '$lib/vendor/dom-typeahead.svelte';
import { PresenceManager } from '$lib/vendor/presence-manager.svelte';
import { DEV } from '$lib/vendor/env';
import type { SelectValueSnippetProps } from '$lib/components/primitive/combobox/index';
import { selectAttrs, INTERACTION_KEYS, FIRST_LAST_KEYS } from './select-shared';

const [getSelectRootContext, setSelectRootContext] = createContext<SelectRoot>();
export { getSelectRootContext };

interface SelectBaseRootStateOpts
	extends
		ReadableProps<{
			disabled: boolean;
			required: boolean;
			name: string;
			loop: boolean;
			scrollAlignment: 'nearest' | 'center';
			items: { value: string; label: string; disabled?: boolean }[];
			allowDeselect: boolean;
			onOpenChangeComplete: OnChangeFn<boolean>;
		}>,
		WritableProps<{
			open: boolean;
			inputValue: string;
		}> {
	isCombobox: boolean;
}

export abstract class SelectBaseRootState {
	readonly opts: SelectBaseRootStateOpts;
	touchedInput = $state(false);
	inputNode = $state<HTMLElement | null>(null);
	contentNode = $state<HTMLElement | null>(null);
	contentPresence: PresenceManager;
	viewportNode = $state<HTMLElement | null>(null);
	triggerNode = $state<HTMLElement | null>(null);
	valueNode = $state<HTMLElement | null>(null);
	valueId = $state('');
	highlightedNode = $state<HTMLElement | null>(null);
	readonly highlightedValue = $derived.by(() => {
		if (!this.highlightedNode) return null;
		return this.highlightedNode.getAttribute('data-value');
	});
	readonly highlightedId = $derived.by(() => {
		if (!this.highlightedNode) return undefined;
		return this.highlightedNode.id;
	});
	readonly highlightedLabel = $derived.by(() => {
		if (!this.highlightedNode) return null;
		return this.highlightedNode.getAttribute('data-label');
	});
	contentIsPositioned = $state(false);
	isUsingKeyboard = false;
	isCombobox = false;
	domContext = new DOMContext(() => null);

	constructor(opts: SelectBaseRootStateOpts) {
		const self = this;
		this.opts = opts;
		this.isCombobox = opts.isCombobox;

		this.contentPresence = new PresenceManager({
			ref: {
				get current() {
					return self.contentNode;
				},
			},
			open: this.opts.open,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			},
		});

		$effect.pre(() => {
			if (!this.opts.open.current) {
				this.setHighlightedNode(null);
			}
		});
	}

	setHighlightedNode(node: HTMLElement | null, initial = false) {
		this.highlightedNode = node;
		if (node && (this.isUsingKeyboard || initial)) {
			this.scrollHighlightedNodeIntoView(node);
		}
	}

	scrollHighlightedNodeIntoView(node: HTMLElement) {
		if (!this.viewportNode || !this.contentIsPositioned) return;
		node.scrollIntoView({ block: this.opts.scrollAlignment.current });
	}

	getCandidateNodes(): HTMLElement[] {
		const node = this.contentNode;
		if (!node) return [];
		return Array.from(node.querySelectorAll<HTMLElement>(`[${this.getBitsAttr('item')}]:not([data-disabled])`));
	}

	setHighlightedToFirstCandidate(initial = false) {
		this.setHighlightedNode(null);

		let nodes = this.getCandidateNodes();
		if (!nodes.length) return;

		// don't consider nodes that aren't visible within the viewport
		if (this.viewportNode) {
			const viewportRect = this.viewportNode.getBoundingClientRect();

			nodes = nodes.filter((node) => {
				if (!this.viewportNode) return false;

				const nodeRect = node.getBoundingClientRect();

				const isNodeFullyVisible =
					nodeRect.right <= viewportRect.right &&
					nodeRect.left >= viewportRect.left &&
					nodeRect.bottom <= viewportRect.bottom &&
					nodeRect.top >= viewportRect.top;

				return isNodeFullyVisible;
			});
		}

		this.setHighlightedNode(nodes[0]!, initial);
	}

	getNodeByValue(value: string): HTMLElement | null {
		const candidateNodes = this.getCandidateNodes();
		return candidateNodes.find((node) => node.dataset.value === value) ?? null;
	}

	/**
	 * Resolves the display label for a value: `items` entry when present, otherwise the
	 * mounted item's `data-label` or its text content.
	 */
	getLabelForValue(value: string): string {
		if (value === '') return '';
		const fromItems = this.opts.items.current.find((item) => item.value === value)?.label;
		if (fromItems !== undefined) return fromItems;
		const node = this.getNodeByValue(value);
		if (node) {
			const dataLabel = node.getAttribute('data-label');
			if (dataLabel !== null && dataLabel !== '') return dataLabel;
			return node.textContent?.trim() ?? value;
		}
		return value;
	}

	setOpen(open: boolean) {
		this.opts.open.current = open;
	}

	toggleOpen() {
		this.opts.open.current = !this.opts.open.current;
	}

	handleOpen() {
		this.setOpen(true);
	}

	handleClose() {
		this.setHighlightedNode(null);
		this.setOpen(false);
	}

	toggleMenu() {
		this.toggleOpen();
	}

	getBitsAttr: typeof selectAttrs.getAttr = (part) => {
		return selectAttrs.getAttr(part, this.isCombobox ? 'combobox' : undefined);
	};
}

interface SelectSingleRootStateOpts
	extends
		SelectBaseRootStateOpts,
		WritableProps<{
			value: string;
		}> {}

export class SelectSingleRootState extends SelectBaseRootState {
	override readonly opts: SelectSingleRootStateOpts;
	readonly isMulti = false as const;
	readonly hasValue = $derived.by(() => this.opts.value.current !== '');
	readonly currentLabel = $derived.by(() => {
		if (!this.opts.items.current.length) return '';
		return this.opts.items.current.find((item) => item.value === this.opts.value.current)?.label ?? '';
	});
	readonly candidateLabels = $derived.by(() => {
		if (!this.opts.items.current.length) return [];
		const filteredItems = this.opts.items.current.filter((item) => !item.disabled);
		return filteredItems.map((item) => item.label);
	});
	readonly dataTypeaheadEnabled = $derived.by(() => {
		if (this.isMulti) return false;
		if (this.opts.items.current.length === 0) return false;
		return true;
	});

	constructor(opts: SelectSingleRootStateOpts) {
		super(opts);

		this.opts = opts;

		$effect(() => {
			if (!this.opts.open.current && this.highlightedNode) {
				this.setHighlightedNode(null);
			}
		});

		$effect(() => {
			void this.opts.open.current;
			untrack(() => {
				if (!this.opts.open.current) return;
				this.setInitialHighlightedNode();
			});
		});
	}

	includesItem(itemValue: string) {
		return this.opts.value.current === itemValue;
	}

	toggleItem(itemValue: string, itemLabel: string = itemValue) {
		const newValue = this.includesItem(itemValue) ? '' : itemValue;
		this.opts.value.current = newValue;
		if (newValue !== '') {
			this.opts.inputValue.current = itemLabel;
		}
	}

	setInitialHighlightedNode() {
		tick().then(() => {
			if (this.highlightedNode && this.domContext.getDocument().contains(this.highlightedNode)) return;
			if (this.opts.value.current !== '') {
				const node = this.getNodeByValue(this.opts.value.current);
				if (node) {
					this.setHighlightedNode(node, true);
					return;
				}
			}
			// if no value is set, we want to highlight the first item
			this.setHighlightedToFirstCandidate(true);
		});
	}
}

interface SelectMultipleRootStateOpts
	extends
		SelectBaseRootStateOpts,
		WritableProps<{
			value: string[];
		}> {}

class SelectMultipleRootState extends SelectBaseRootState {
	override readonly opts: SelectMultipleRootStateOpts;
	readonly isMulti = true as const;
	readonly hasValue = $derived.by(() => this.opts.value.current.length > 0);

	constructor(opts: SelectMultipleRootStateOpts) {
		super(opts);

		this.opts = opts;

		$effect(() => {
			if (!this.opts.open.current && this.highlightedNode) {
				this.setHighlightedNode(null);
			}
		});

		$effect(() => {
			void this.opts.open.current;
			untrack(() => {
				if (!this.opts.open.current) return;
				this.setInitialHighlightedNode();
			});
		});
	}

	includesItem(itemValue: string) {
		return this.opts.value.current.includes(itemValue);
	}

	toggleItem(itemValue: string, itemLabel: string = itemValue) {
		if (this.includesItem(itemValue)) {
			this.opts.value.current = this.opts.value.current.filter((v) => v !== itemValue);
		} else {
			this.opts.value.current = [...this.opts.value.current, itemValue];
		}
		this.opts.inputValue.current = itemLabel;
	}

	setInitialHighlightedNode() {
		tick().then(() => {
			if (!this.domContext) return;
			if (this.highlightedNode && this.domContext.getDocument().contains(this.highlightedNode)) return;
			if (this.opts.value.current.length && this.opts.value.current[0] !== '') {
				const node = this.getNodeByValue(this.opts.value.current[0]!);
				if (node) {
					this.setHighlightedNode(node, true);
					return;
				}
			}
			// if no value is set, we want to highlight the first item
			this.setHighlightedToFirstCandidate(true);
		});
	}
}

interface SelectRootStateOpts
	extends
		ReadableProps<{
			disabled: boolean;
			required: boolean;
			loop: boolean;
			scrollAlignment: 'nearest' | 'center';
			name: string;
			items: { value: string; label: string; disabled?: boolean }[];
			allowDeselect: boolean;
			onOpenChangeComplete: OnChangeFn<boolean>;
		}>,
		WritableProps<{
			open: boolean;
			inputValue: string;
		}> {
	isCombobox: boolean;
	type: 'single' | 'multiple';
	value: WritableProp<string> | WritableProp<string[]>;
}

export class SelectRootState {
	static create(props: SelectRootStateOpts): SelectRoot {
		const { type, ...rest } = props;

		const rootState =
			type === 'single'
				? new SelectSingleRootState(rest as SelectSingleRootStateOpts)
				: new SelectMultipleRootState(rest as SelectMultipleRootStateOpts);

		return setSelectRootContext(rootState);
	}
}

export type SelectRoot = SelectSingleRootState | SelectMultipleRootState;

type SelectValueStateProps = WithRefProps<
	ReadableProps<{
		placeholder: string | null | undefined;
	}>
>;

export class SelectValueState {
	static create(opts: SelectValueStateProps) {
		return new SelectValueState(opts, getSelectRootContext());
	}
	readonly root: SelectRoot;
	readonly opts: SelectValueStateProps;
	readonly attachment: RefAttachment;

	constructor(opts: SelectValueStateProps, root: SelectRoot) {
		this.root = root;
		this.opts = opts;
		this.attachment = attachRef(opts.ref, (v) => (this.root.valueNode = v));
		this.setValue = this.setValue.bind(this);
	}

	setValue(value: string | string[]) {
		if (this.root.isMulti && !Array.isArray(value)) {
			if (DEV) throw new Error(`Expected an array of strings passed to \`setValue\` got ${typeof value}.`);
			return;
		}
		if (!this.root.isMulti && typeof value !== 'string') {
			if (DEV) throw new Error(`Expected a string passed to \`setValue\` got ${typeof value}.`);
			return;
		}
		this.root.opts.value.current = value;
	}

	// this way consumers get type narrowing for the value on `type`
	readonly snippetProps: SelectValueSnippetProps = $derived.by(() => {
		if (this.root.isMulti) {
			return {
				selection: {
					type: 'multiple' as const,
					selected:
						this.root.opts.value.current.length > 0
							? this.root.opts.value.current.map((value) => ({
									value,
									label: this.root.getLabelForValue(value),
								}))
							: [],
					setValue: this.setValue,
				},
				placeholder: this.opts.placeholder.current ?? null,
				disabled: this.root.opts.disabled.current,
			};
		}
		const value = this.root.opts.value.current;
		return {
			selection: {
				type: 'single' as const,
				selected: value !== '' ? { value, label: value === '' ? '' : this.root.getLabelForValue(value) } : undefined,
				setValue: this.setValue,
			},
			placeholder: this.opts.placeholder.current ?? null,
			disabled: this.root.opts.disabled.current,
		};
	});

	readonly props = $derived.by(() => ({
		id: this.opts.id.current,
		'data-placeholder': this.root.hasValue ? undefined : '',
		'data-select-value': '',
		...this.attachment,
	}));
}

interface SelectInputStateOpts
	extends
		WithRefProps,
		ReadableProps<{
			clearOnDeselect: boolean;
		}> {}

export class SelectInputState {
	static create(opts: SelectInputStateOpts) {
		return new SelectInputState(opts, getSelectRootContext());
	}
	readonly opts: SelectInputStateOpts;
	readonly root: SelectRoot;
	readonly attachment: RefAttachment;

	constructor(opts: SelectInputStateOpts, root: SelectRoot) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref, (v) => (this.root.inputNode = v));
		this.root.domContext = new DOMContext(opts.ref);

		this.onkeydown = this.onkeydown.bind(this);
		this.oninput = this.oninput.bind(this);

		let prevValues: unknown[] = [];
		$effect(() => {
			const value = this.root.opts.value.current;
			const clearOnDeselect = this.opts.clearOnDeselect.current;
			const [prevValue] = prevValues;
			untrack(() => {
				if (!clearOnDeselect) return;
				if (Array.isArray(value) && Array.isArray(prevValue)) {
					if (value.length === 0 && prevValue.length !== 0) {
						this.root.opts.inputValue.current = '';
					}
				} else if (value === '' && prevValue !== '') {
					this.root.opts.inputValue.current = '';
				}
			});
			prevValues = [value, clearOnDeselect];
		});
	}

	onkeydown(e: BitsKeyboardEvent) {
		this.root.isUsingKeyboard = true;
		if (e.key === kbd.ESCAPE) return;

		// prevent arrow up/down from moving the position of the cursor in the input
		if (e.key === kbd.ARROW_UP || e.key === kbd.ARROW_DOWN) e.preventDefault();
		if (!this.root.opts.open.current) {
			if (INTERACTION_KEYS.includes(e.key)) return;
			if (e.key === kbd.TAB) return;
			if (e.key === kbd.BACKSPACE && this.root.opts.inputValue.current === '') return;
			this.root.handleOpen();
			// we need to wait for a tick after the menu opens to ensure the highlighted nodes are
			// set correctly.
			if (this.root.hasValue) return;
			const candidateNodes = this.root.getCandidateNodes();
			if (!candidateNodes.length) return;

			if (e.key === kbd.ARROW_DOWN) {
				const firstCandidate = candidateNodes[0]!;
				this.root.setHighlightedNode(firstCandidate);
			} else if (e.key === kbd.ARROW_UP) {
				const lastCandidate = candidateNodes[candidateNodes.length - 1]!;
				this.root.setHighlightedNode(lastCandidate);
			}
			return;
		}

		if (e.key === kbd.TAB) {
			this.root.handleClose();
			return;
		}

		if (e.key === kbd.ENTER && !e.isComposing) {
			e.preventDefault();

			const isCurrentSelectedValue = this.root.highlightedValue === this.root.opts.value.current;

			if (!this.root.opts.allowDeselect.current && isCurrentSelectedValue && !this.root.isMulti) {
				this.root.handleClose();
				return;
			}

			if (this.root.highlightedValue && this.root.highlightedNode && this.root.highlightedNode.isConnected) {
				this.root.toggleItem(this.root.highlightedValue, this.root.highlightedLabel ?? undefined);
			}
			if (!this.root.isMulti && !isCurrentSelectedValue) {
				this.root.handleClose();
			}
		}

		if (e.key === kbd.ARROW_UP && e.altKey) {
			this.root.handleClose();
		}

		if (FIRST_LAST_KEYS.includes(e.key)) {
			e.preventDefault();
			const candidateNodes = this.root.getCandidateNodes();
			const currHighlightedNode = this.root.highlightedNode;
			const currIndex = currHighlightedNode ? candidateNodes.indexOf(currHighlightedNode) : -1;

			const loop = this.root.opts.loop.current;
			let nextItem: HTMLElement | undefined;

			if (e.key === kbd.ARROW_DOWN) {
				nextItem = next(candidateNodes, currIndex, loop);
			} else if (e.key === kbd.ARROW_UP) {
				nextItem = prev(candidateNodes, currIndex, loop);
			} else if (e.key === kbd.PAGE_DOWN) {
				nextItem = forward(candidateNodes, currIndex, 10, loop);
			} else if (e.key === kbd.PAGE_UP) {
				nextItem = backward(candidateNodes, currIndex, 10, loop);
			} else if (e.key === kbd.HOME) {
				nextItem = candidateNodes[0];
			} else if (e.key === kbd.END) {
				nextItem = candidateNodes[candidateNodes.length - 1];
			}
			if (!nextItem) return;
			this.root.setHighlightedNode(nextItem);
			return;
		}

		if (INTERACTION_KEYS.includes(e.key)) return;
		if (!this.root.highlightedNode) {
			this.root.setHighlightedToFirstCandidate();
		}
	}

	oninput(e: BitsEvent<Event, HTMLInputElement>) {
		this.root.opts.inputValue.current = e.currentTarget.value;
		this.root.setHighlightedToFirstCandidate();
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: 'combobox',
				disabled: this.root.opts.disabled.current ? true : undefined,
				'aria-activedescendant': this.root.highlightedId,
				'aria-autocomplete': 'list',
				'aria-expanded': this.root.opts.open.current ? 'true' : 'false',
				'data-state': this.root.opts.open.current ? 'open' : 'closed',
				'data-disabled': this.root.opts.disabled.current ? '' : undefined,
				onkeydown: this.onkeydown,
				oninput: this.oninput,
				[this.root.getBitsAttr('input')]: '',
				...this.attachment,
			}) as const,
	);
}

interface SelectComboTriggerStateOpts extends WithRefProps {}

export class SelectComboTriggerState {
	static create(opts: SelectComboTriggerStateOpts) {
		return new SelectComboTriggerState(opts, getSelectRootContext());
	}
	readonly opts: SelectComboTriggerStateOpts;
	readonly root: SelectBaseRootState;
	readonly attachment: RefAttachment;

	constructor(opts: SelectComboTriggerStateOpts, root: SelectBaseRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref);
		this.onkeydown = this.onkeydown.bind(this);
		this.onpointerdown = this.onpointerdown.bind(this);
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (!this.root.domContext) return;
		if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
			e.preventDefault();
			if (this.root.domContext.getActiveElement() !== this.root.inputNode) {
				this.root.inputNode?.focus();
			}
			this.root.toggleMenu();
		}
	}

	/**
	 * `pointerdown` fires before the `focus` event, so we can prevent the default
	 * behavior of focusing the button and keep focus on the input.
	 */
	onpointerdown(e: BitsPointerEvent) {
		if (this.root.opts.disabled.current || !this.root.domContext) return;
		e.preventDefault();
		if (this.root.domContext.getActiveElement() !== this.root.inputNode) {
			this.root.inputNode?.focus();
		}
		this.root.toggleMenu();
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				disabled: this.root.opts.disabled.current ? true : undefined,
				'aria-haspopup': 'listbox',
				'data-state': this.root.opts.open.current ? 'open' : 'closed',
				'data-disabled': this.root.opts.disabled.current ? '' : undefined,
				[this.root.getBitsAttr('trigger')]: '',
				onpointerdown: this.onpointerdown,
				onkeydown: this.onkeydown,
				...this.attachment,
			}) as const,
	);
}

interface SelectTriggerStateOpts extends WithRefProps {}

export class SelectTriggerState {
	static create(opts: SelectTriggerStateOpts) {
		return new SelectTriggerState(opts, getSelectRootContext());
	}
	readonly opts: SelectTriggerStateOpts;
	readonly root: SelectRoot;
	readonly attachment: RefAttachment;
	readonly #domTypeahead: DOMTypeahead;
	readonly #dataTypeahead: DataTypeahead;

	constructor(opts: SelectTriggerStateOpts, root: SelectRoot) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref, (v) => (this.root.triggerNode = v));
		this.root.domContext = new DOMContext(opts.ref);

		this.#domTypeahead = new DOMTypeahead({
			getCurrentItem: () => this.root.highlightedNode,
			onMatch: (node) => {
				this.root.setHighlightedNode(node);
			},
			getActiveElement: () => this.root.domContext.getActiveElement(),
			getWindow: () => this.root.domContext.getWindow(),
		});

		this.#dataTypeahead = new DataTypeahead({
			getCurrentItem: () => {
				if (this.root.isMulti) return '';
				return this.root.currentLabel;
			},
			onMatch: (label: string) => {
				if (this.root.isMulti) return;
				if (!this.root.opts.items.current) return;
				const matchedItem = this.root.opts.items.current.find((item) => item.label === label);
				if (!matchedItem) return;
				this.root.opts.value.current = matchedItem.value;
			},
			enabled: () => !this.root.isMulti && this.root.dataTypeaheadEnabled,
			candidateValues: () => (this.root.isMulti ? [] : this.root.candidateLabels),
			getWindow: () => this.root.domContext.getWindow(),
		});

		this.onkeydown = this.onkeydown.bind(this);
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointerup = this.onpointerup.bind(this);
		this.onclick = this.onclick.bind(this);
	}

	#handleOpen() {
		this.root.opts.open.current = true;
		this.#dataTypeahead.resetTypeahead();
		this.#domTypeahead.resetTypeahead();
	}

	#handlePointerOpen(_: PointerEvent) {
		this.#handleOpen();
	}

	/**
	 * Logic used to handle keyboard selection/deselection.
	 *
	 * If it returns true, it means the item was selected and whatever is calling
	 * this function should return early
	 *
	 */
	#handleKeyboardSelection() {
		const isCurrentSelectedValue = this.root.highlightedValue === this.root.opts.value.current;

		if (!this.root.opts.allowDeselect.current && isCurrentSelectedValue && !this.root.isMulti) {
			this.root.handleClose();
			return true;
		}

		// "" is a valid value for a select item so we need to check for that
		if (this.root.highlightedValue !== null) {
			this.root.toggleItem(this.root.highlightedValue, this.root.highlightedLabel ?? undefined);
		}

		if (!this.root.isMulti && !isCurrentSelectedValue) {
			this.root.handleClose();
			return true;
		}

		return false;
	}

	onkeydown(e: BitsKeyboardEvent) {
		this.root.isUsingKeyboard = true;
		if (e.key === kbd.ARROW_UP || e.key === kbd.ARROW_DOWN) e.preventDefault();

		if (!this.root.opts.open.current) {
			if (e.key === kbd.ENTER || e.key === kbd.SPACE || e.key === kbd.ARROW_DOWN || e.key === kbd.ARROW_UP) {
				e.preventDefault();
				this.root.handleOpen();
			} else if (!this.root.isMulti && this.root.dataTypeaheadEnabled) {
				this.#dataTypeahead.handleTypeaheadSearch(e.key);
				return;
			}

			// we need to wait for a tick after the menu opens to ensure
			// the highlighted nodes are set correctly
			if (this.root.hasValue) return;
			const candidateNodes = this.root.getCandidateNodes();
			if (!candidateNodes.length) return;

			if (e.key === kbd.ARROW_DOWN) {
				const firstCandidate = candidateNodes[0]!;
				this.root.setHighlightedNode(firstCandidate);
			} else if (e.key === kbd.ARROW_UP) {
				const lastCandidate = candidateNodes[candidateNodes.length - 1]!;
				this.root.setHighlightedNode(lastCandidate);
			}
			return;
		}

		if (e.key === kbd.TAB) {
			this.root.handleClose();
			return;
		}

		if (
			(e.key === kbd.ENTER ||
				// if we're currently "typing ahead", we don't want to select the item
				// just yet as the item the user is trying to get to may have a space in it,
				// so we defer handling the close for this case until further down
				(e.key === kbd.SPACE && this.#domTypeahead.search === '')) &&
			!e.isComposing
		) {
			e.preventDefault();
			const shouldReturn = this.#handleKeyboardSelection();
			if (shouldReturn) return;
		}

		if (e.key === kbd.ARROW_UP && e.altKey) {
			this.root.handleClose();
		}

		if (FIRST_LAST_KEYS.includes(e.key)) {
			e.preventDefault();
			const candidateNodes = this.root.getCandidateNodes();
			const currHighlightedNode = this.root.highlightedNode;
			const currIndex = currHighlightedNode ? candidateNodes.indexOf(currHighlightedNode) : -1;

			const loop = this.root.opts.loop.current;
			let nextItem: HTMLElement | undefined;

			if (e.key === kbd.ARROW_DOWN) {
				nextItem = next(candidateNodes, currIndex, loop);
			} else if (e.key === kbd.ARROW_UP) {
				nextItem = prev(candidateNodes, currIndex, loop);
			} else if (e.key === kbd.PAGE_DOWN) {
				nextItem = forward(candidateNodes, currIndex, 10, loop);
			} else if (e.key === kbd.PAGE_UP) {
				nextItem = backward(candidateNodes, currIndex, 10, loop);
			} else if (e.key === kbd.HOME) {
				nextItem = candidateNodes[0];
			} else if (e.key === kbd.END) {
				nextItem = candidateNodes[candidateNodes.length - 1];
			}
			if (!nextItem) return;
			this.root.setHighlightedNode(nextItem);
			return;
		}
		const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
		const isCharacterKey = e.key.length === 1;
		const isSpaceKey = e.key === kbd.SPACE;

		const candidateNodes = this.root.getCandidateNodes();

		if (e.key === kbd.TAB) return;

		if (!isModifierKey && (isCharacterKey || isSpaceKey)) {
			const matchedNode = this.#domTypeahead.handleTypeaheadSearch(e.key, candidateNodes);
			if (!matchedNode && isSpaceKey) {
				e.preventDefault();
				this.#handleKeyboardSelection();
			}
			return;
		}

		if (!this.root.highlightedNode) {
			this.root.setHighlightedToFirstCandidate();
		}
	}

	onclick(e: BitsMouseEvent) {
		// While browsers generally have no issue focusing the trigger when clicking
		// on a label, Safari seems to struggle with the fact that there's no `onClick`.
		// We force `focus` in this case. Note: this doesn't create any other side-effect
		// because we are preventing default in `onpointerdown` so effectively
		// this only runs for a label 'click'
		const currTarget = e.currentTarget as HTMLElement;
		currTarget.focus();
	}

	onpointerdown(e: BitsPointerEvent) {
		if (this.root.opts.disabled.current) return;
		// prevent opening on touch down which can be triggered when scrolling on touch devices
		if (e.pointerType === 'touch') return e.preventDefault();

		// prevent implicit pointer capture
		const target = e.target as HTMLElement;
		if (target?.hasPointerCapture(e.pointerId)) {
			target?.releasePointerCapture(e.pointerId);
		}

		// only call the handle if it's a left click, since pointerdown is triggered
		// by right clicks as well, but not when ctrl is pressed
		if (e.button === 0 && e.ctrlKey === false) {
			if (this.root.opts.open.current === false) {
				this.#handlePointerOpen(e);
			} else {
				this.root.handleClose();
			}
		}
	}

	onpointerup(e: BitsPointerEvent) {
		if (this.root.opts.disabled.current) return;
		e.preventDefault();
		if (e.pointerType === 'touch') {
			if (this.root.opts.open.current === false) {
				this.#handlePointerOpen(e);
			} else {
				this.root.handleClose();
			}
		}
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				disabled: this.root.opts.disabled.current ? true : undefined,
				'aria-haspopup': 'listbox',
				'aria-expanded': this.root.opts.open.current ? 'true' : 'false',
				'aria-activedescendant': this.root.highlightedId,
				'data-state': this.root.opts.open.current ? 'open' : 'closed',
				'data-disabled': this.root.opts.disabled.current ? '' : undefined,
				'data-placeholder': this.root.hasValue ? undefined : '',
				[this.root.getBitsAttr('trigger')]: '',
				onpointerdown: this.onpointerdown,
				onkeydown: this.onkeydown,
				onclick: this.onclick,
				onpointerup: this.onpointerup,
				...this.attachment,
			}) as const,
	);
}

interface SelectItemStateOpts
	extends
		WithRefProps,
		ReadableProps<{
			value: string;
			disabled: boolean;
			label: string;
			onHighlight: () => void;
			onUnhighlight: () => void;
		}> {}

export class SelectItemState {
	static create(opts: SelectItemStateOpts) {
		return new SelectItemState(opts, getSelectRootContext());
	}
	readonly opts: SelectItemStateOpts;
	readonly root: SelectRoot;
	readonly attachment: RefAttachment;
	readonly isSelected = $derived.by(() => this.root.includesItem(this.opts.value.current));
	readonly isHighlighted = $derived.by(() => this.root.highlightedValue === this.opts.value.current);
	mounted = $state(false);

	constructor(opts: SelectItemStateOpts, root: SelectRoot) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref);

		let wasHighlightedPrev: boolean | undefined = undefined;
		$effect(() => {
			const isHighlighted = this.isHighlighted;
			const wasHighlighted = wasHighlightedPrev;
			untrack(() => {
				if (isHighlighted) {
					this.opts.onHighlight.current();
				} else if (wasHighlighted) {
					this.opts.onUnhighlight.current();
				}
			});
			wasHighlightedPrev = isHighlighted;
		});

		$effect(() => {
			void this.mounted;
			untrack(() => {
				if (!this.mounted) return;
				this.root.setInitialHighlightedNode();
			});
		});

		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointerup = this.onpointerup.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
	}

	handleSelect() {
		if (this.opts.disabled.current) return;
		const isCurrentSelectedValue = this.opts.value.current === this.root.opts.value.current;

		// if allowDeselect is false and the item is already selected and we're not in a
		// multi select, do nothing and close the menu
		if (!this.root.opts.allowDeselect.current && isCurrentSelectedValue && !this.root.isMulti) {
			this.root.handleClose();
			return;
		}

		// otherwise, toggle the item and if we're not in a multi select, close the menu
		this.root.toggleItem(this.opts.value.current, this.opts.label.current);

		if (!this.root.isMulti && !isCurrentSelectedValue) {
			this.root.handleClose();
		}
	}

	snippetProps = $derived.by(() => ({
		selected: this.isSelected,
		highlighted: this.isHighlighted,
	}));

	onpointerdown(e: BitsPointerEvent) {
		// prevent focus from leaving the input/select trigger
		e.preventDefault();
	}

	/**
	 * Using `pointerup` instead of `click` allows power users to pointerdown
	 * the trigger, then release pointerup on an item to select it vs having to do
	 * multiple clicks.
	 */
	onpointerup(e: BitsPointerEvent) {
		if (e.defaultPrevented || !this.opts.ref.current) return;
		/**
		 * For one reason or another, when it's a touch pointer and _not_ on IOS,
		 * we need to listen for the immediate click event to handle the selection,
		 * otherwise a click event will fire on the element _behind_ the item.
		 */
		if (e.pointerType === 'touch' && !isIOS) {
			on(
				this.opts.ref.current,
				'click',
				() => {
					this.handleSelect();
					// set highlighted node since we don't do it on `pointermove` events
					// for touch devices
					this.root.setHighlightedNode(this.opts.ref.current);
				},
				{ once: true },
			);
			return;
		}
		e.preventDefault();

		this.handleSelect();
		if (e.pointerType === 'touch') {
			// set highlighted node since we don't do it on `pointermove` events
			// for touch devices
			this.root.setHighlightedNode(this.opts.ref.current);
		}
	}

	onpointermove(e: BitsPointerEvent) {
		/**
		 * We don't want to highlight items on touch devices when scrolling,
		 * as this is confusing behavior, so we return here and instead handle
		 * the highlighting on the `pointerup` (or following `click`) event for
		 * touch devices only.
		 */
		if (e.pointerType === 'touch') return;
		if (this.root.highlightedNode !== this.opts.ref.current) {
			this.root.setHighlightedNode(this.opts.ref.current);
		}
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: 'option',
				'aria-selected': this.root.includesItem(this.opts.value.current) ? 'true' : undefined,
				'data-value': this.opts.value.current,
				'data-disabled': this.opts.disabled.current ? '' : undefined,
				'data-highlighted': this.root.highlightedValue === this.opts.value.current && !this.opts.disabled.current ? '' : undefined,
				'data-selected': this.root.includesItem(this.opts.value.current) ? '' : undefined,
				'data-label': this.opts.label.current,
				[this.root.getBitsAttr('item')]: '',
				onpointermove: this.onpointermove,
				onpointerdown: this.onpointerdown,
				onpointerup: this.onpointerup,
				...this.attachment,
			}) as const,
	);
}

interface SelectHiddenInputStateOpts extends ReadableProps<{
	value: string | undefined;
}> {}

export class SelectHiddenInputState {
	static create(opts: SelectHiddenInputStateOpts) {
		return new SelectHiddenInputState(opts, getSelectRootContext());
	}
	readonly opts: SelectHiddenInputStateOpts;
	readonly root: SelectBaseRootState;
	readonly shouldRender = $derived.by(() => this.root.opts.name.current !== '');

	constructor(opts: SelectHiddenInputStateOpts, root: SelectBaseRootState) {
		this.opts = opts;
		this.root = root;
		this.onfocus = this.onfocus.bind(this);
	}

	onfocus(e: BitsFocusEvent) {
		e.preventDefault();

		if (!this.root.isCombobox) {
			this.root.triggerNode?.focus();
		} else {
			this.root.inputNode?.focus();
		}
	}

	readonly props = $derived.by(
		() =>
			({
				disabled: this.root.opts.disabled.current ? true : undefined,
				required: this.root.opts.required.current ? true : undefined,
				name: this.root.opts.name.current,
				value: this.opts.value.current,
				onfocus: this.onfocus,
			}) as const,
	);
}
