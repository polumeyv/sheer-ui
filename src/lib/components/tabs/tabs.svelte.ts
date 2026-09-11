import { createContext, untrack } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';
import { attachRef } from '../../internal/tools/index.js';
import type { TabsActivationMode } from './types.js';
import { createBitsAttrs, boolToStr, boolToEmptyStrOrUndef, boolToTrueOrUndef } from '../../internal/attrs.js';
import { kbd } from '../../internal/kbd.js';
import type { BitsFocusEvent, BitsKeyboardEvent, BitsMouseEvent, RefAttachment, RefOpts } from '../../internal/types.js';
import type { Orientation } from '../../internal/index.js';
import { RovingFocusGroup } from '../../internal/roving-focus-group.svelte.js';

const tabsAttrs = createBitsAttrs({
	component: 'tabs',
	parts: ['root', 'list', 'trigger', 'content'],
});

const [getTabsRoot, setTabsRoot] = createContext<TabsRootState>();

interface TabsRootStateOpts extends RefOpts {
	readonly orientation: Orientation;
	readonly loop: boolean;
	readonly activationMode: TabsActivationMode;
	readonly disabled: boolean;
	value: string;
}

export class TabsRootState {
	static create(opts: TabsRootStateOpts) {
		return setTabsRoot(new TabsRootState(opts));
	}
	readonly opts: TabsRootStateOpts;
	readonly attachment: RefAttachment;
	readonly rovingFocusGroup: RovingFocusGroup;
	triggerIds = $state<string[]>([]);
	// holds the trigger ID for each value to associate it with the content
	readonly valueToTriggerId = new SvelteMap<string, string>();
	// holds the content ID for each value to associate it with the trigger
	readonly valueToContentId = new SvelteMap<string, string>();

	constructor(opts: TabsRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef<HTMLElement>((v) => (opts.ref = v));
		this.rovingFocusGroup = new RovingFocusGroup({
			candidateAttr: tabsAttrs.trigger,
			rootNode: () => opts.ref,
			loop: () => opts.loop,
			orientation: () => opts.orientation,
		});
	}

	registerTrigger(id: string, value: string) {
		this.triggerIds.push(id);
		this.valueToTriggerId.set(value, id);

		// returns the deregister function
		return () => {
			this.triggerIds = this.triggerIds.filter((triggerId) => triggerId !== id);
			this.valueToTriggerId.delete(value);
		};
	}

	registerContent(id: string, value: string) {
		this.valueToContentId.set(value, id);

		// returns the deregister function
		return () => {
			this.valueToContentId.delete(value);
		};
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id,
				'data-orientation': this.opts.orientation,
				[tabsAttrs.root]: '',
				...this.attachment,
			}) as const,
	);
}

interface TabsListStateOpts extends RefOpts {}

export class TabsListState {
	static create(opts: TabsListStateOpts) {
		return new TabsListState(opts, getTabsRoot());
	}
	readonly opts: TabsListStateOpts;
	readonly root: TabsRootState;
	readonly attachment: RefAttachment;

	constructor(opts: TabsListStateOpts, root: TabsRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef<HTMLElement>((v) => (opts.ref = v));
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id,
				role: 'tablist',
				'aria-orientation': this.root.opts.orientation,
				'data-orientation': this.root.opts.orientation,
				[tabsAttrs.list]: '',
				'data-disabled': boolToEmptyStrOrUndef(this.root.opts.disabled),
				...this.attachment,
			}) as const,
	);
}

interface TabsTriggerStateOpts extends RefOpts {
	readonly value: string;
	readonly disabled: boolean;
}

export class TabsTriggerState {
	static create(opts: TabsTriggerStateOpts) {
		return new TabsTriggerState(opts, getTabsRoot());
	}
	readonly opts: TabsTriggerStateOpts;
	readonly root: TabsRootState;
	readonly attachment: RefAttachment;
	readonly #isActive = $derived.by(() => this.root.opts.value === this.opts.value);
	readonly #tabIndex = $derived.by(() => (this.#isActive || !this.root.opts.value ? 0 : -1));
	readonly #isDisabled = $derived.by(() => this.opts.disabled || this.root.opts.disabled);
	readonly #ariaControls = $derived.by(() => this.root.valueToContentId.get(this.opts.value));

	constructor(opts: TabsTriggerStateOpts, root: TabsRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef<HTMLElement>((v) => (opts.ref = v));
		$effect(() => {
			const id = this.opts.id;
			const value = this.opts.value;
			return untrack(() => {
				return this.root.registerTrigger(id, value);
			});
		});

		this.onfocus = this.onfocus.bind(this);
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	#activate() {
		if (this.root.opts.value === this.opts.value) return;
		this.root.opts.value = this.opts.value;
	}

	onfocus(_: BitsFocusEvent) {
		if (this.root.opts.activationMode !== 'automatic' || this.#isDisabled) return;
		this.#activate();
	}

	onclick(_: BitsMouseEvent) {
		if (this.#isDisabled) return;
		this.#activate();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.#isDisabled) return;
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.#activate();
			return;
		}
		this.root.rovingFocusGroup.handleKeydown(this.opts.ref, e);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id,
				role: 'tab',
				'data-state': getTabDataState(this.#isActive),
				'data-value': this.opts.value,
				'data-orientation': this.root.opts.orientation,
				'data-disabled': boolToEmptyStrOrUndef(this.#isDisabled),
				'aria-selected': boolToStr(this.#isActive),
				'aria-controls': this.#ariaControls,
				[tabsAttrs.trigger]: '',
				disabled: boolToTrueOrUndef(this.#isDisabled),
				tabindex: this.#tabIndex,
				//
				onclick: this.onclick,
				onfocus: this.onfocus,
				onkeydown: this.onkeydown,
				...this.attachment,
			}) as const,
	);
}

interface TabsContentStateOpts extends RefOpts {
	readonly value: string;
}

export class TabsContentState {
	static create(opts: TabsContentStateOpts) {
		return new TabsContentState(opts, getTabsRoot());
	}
	readonly opts: TabsContentStateOpts;
	readonly root: TabsRootState;
	readonly attachment: RefAttachment;
	readonly #isActive = $derived.by(() => this.root.opts.value === this.opts.value);
	readonly #ariaLabelledBy = $derived.by(() => this.root.valueToTriggerId.get(this.opts.value));

	constructor(opts: TabsContentStateOpts, root: TabsRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef<HTMLElement>((v) => (opts.ref = v));
		$effect(() => {
			const id = this.opts.id;
			const value = this.opts.value;
			return untrack(() => {
				return this.root.registerContent(id, value);
			});
		});
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id,
				role: 'tabpanel',
				hidden: boolToTrueOrUndef(!this.#isActive),
				tabindex: 0,
				'data-value': this.opts.value,
				'data-state': getTabDataState(this.#isActive),
				'aria-labelledby': this.#ariaLabelledBy,
				'data-orientation': this.root.opts.orientation,
				[tabsAttrs.content]: '',
				...this.attachment,
			}) as const,
	);
}

const getTabDataState = (condition: boolean): 'active' | 'inactive' => condition ? 'active' : 'inactive';
