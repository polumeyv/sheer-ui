import { createContext, untrack } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';
import { attachRef, type RefAttachment } from '$lib/vendor/attach-ref';
import type { TabsActivationMode } from '$lib/components/primitive/tabs/index';
import { createBitsAttrs } from '$lib/vendor/attrs';
import { kbd } from '$lib/vendor/kbd';
import type { ReadableProps, WithRefProps, WritableProps } from '$lib/vendor/utils';
import type { BitsFocusEvent, BitsKeyboardEvent, BitsMouseEvent } from '$lib/vendor/types';
import type { Orientation } from '$lib/shared/index';
import { RovingFocusGroup } from '$lib/vendor/roving-focus-group';

const tabsAttrs = createBitsAttrs({
	component: 'tabs',
	parts: ['root', 'list', 'trigger', 'content'],
});

const [getTabsRootContext, setTabsRootContext] = createContext<TabsRootState>();

interface TabsRootStateOpts
	extends
		WithRefProps,
		ReadableProps<{
			orientation: Orientation;
			loop: boolean;
			activationMode: TabsActivationMode;
			disabled: boolean;
		}>,
		WritableProps<{
			value: string;
		}> {}

export class TabsRootState {
	static create(opts: TabsRootStateOpts) {
		return setTabsRootContext(new TabsRootState(opts));
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
		this.attachment = attachRef<HTMLElement>((v) => (opts.ref.current = v));
		this.rovingFocusGroup = new RovingFocusGroup({
			candidateAttr: tabsAttrs.trigger,
			rootNode: this.opts.ref,
			loop: this.opts.loop,
			orientation: this.opts.orientation,
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

	setValue(v: string) {
		this.opts.value.current = v;
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				'data-orientation': this.opts.orientation.current,
				[tabsAttrs.root]: '',
				...this.attachment,
			}) as const,
	);
}

interface TabsListStateOpts extends WithRefProps {}

export class TabsListState {
	static create(opts: TabsListStateOpts) {
		return new TabsListState(opts, getTabsRootContext());
	}
	readonly opts: TabsListStateOpts;
	readonly root: TabsRootState;
	readonly attachment: RefAttachment;
	readonly #isDisabled = $derived.by(() => this.root.opts.disabled.current);

	constructor(opts: TabsListStateOpts, root: TabsRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef<HTMLElement>((v) => (opts.ref.current = v));
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: 'tablist',
				'aria-orientation': this.root.opts.orientation.current,
				'data-orientation': this.root.opts.orientation.current,
				[tabsAttrs.list]: '',
				'data-disabled': this.#isDisabled ? '' : undefined,
				...this.attachment,
			}) as const,
	);
}

interface TabsTriggerStateOpts
	extends
		WithRefProps,
		ReadableProps<{
			value: string;
			disabled: boolean;
		}> {}

export class TabsTriggerState {
	static create(opts: TabsTriggerStateOpts) {
		return new TabsTriggerState(opts, getTabsRootContext());
	}
	readonly opts: TabsTriggerStateOpts;
	readonly root: TabsRootState;
	readonly attachment: RefAttachment;
	readonly #isActive = $derived.by(() => this.root.opts.value.current === this.opts.value.current);
	// Roving tabindex: the active trigger — or every trigger while nothing is selected yet — is focusable.
	readonly #tabIndex = $derived.by(() => (this.#isActive || !this.root.opts.value.current ? 0 : -1));
	readonly #isDisabled = $derived.by(() => this.opts.disabled.current || this.root.opts.disabled.current);
	readonly #ariaControls = $derived.by(() => this.root.valueToContentId.get(this.opts.value.current));

	constructor(opts: TabsTriggerStateOpts, root: TabsRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef<HTMLElement>((v) => (opts.ref.current = v));
		// register/deregister with the root; untrack the body so the triggerIds
		// mutation inside registerTrigger isn't tracked as a dependency
		$effect(() => {
			const id = this.opts.id.current;
			const value = this.opts.value.current;
			return untrack(() => this.root.registerTrigger(id, value));
		});

		this.onfocus = this.onfocus.bind(this);
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	#activate() {
		if (this.root.opts.value.current === this.opts.value.current) return;
		this.root.setValue(this.opts.value.current);
	}

	onfocus(_: BitsFocusEvent) {
		if (this.root.opts.activationMode.current !== 'automatic' || this.#isDisabled) return;
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
		this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: 'tab',
				'data-state': getTabDataState(this.#isActive),
				'data-value': this.opts.value.current,
				'data-orientation': this.root.opts.orientation.current,
				'data-disabled': this.#isDisabled ? '' : undefined,
				'aria-selected': this.#isActive ? 'true' : 'false',
				'aria-controls': this.#ariaControls,
				[tabsAttrs.trigger]: '',
				disabled: this.#isDisabled ? true : undefined,
				tabindex: this.#tabIndex,
				//
				onclick: this.onclick,
				onfocus: this.onfocus,
				onkeydown: this.onkeydown,
				...this.attachment,
			}) as const,
	);
}

interface TabsContentStateOpts
	extends
		WithRefProps,
		ReadableProps<{
			value: string;
		}> {}

export class TabsContentState {
	static create(opts: TabsContentStateOpts) {
		return new TabsContentState(opts, getTabsRootContext());
	}
	readonly opts: TabsContentStateOpts;
	readonly root: TabsRootState;
	readonly attachment: RefAttachment;
	readonly #isActive = $derived.by(() => this.root.opts.value.current === this.opts.value.current);
	readonly #ariaLabelledBy = $derived.by(() => this.root.valueToTriggerId.get(this.opts.value.current));

	constructor(opts: TabsContentStateOpts, root: TabsRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef<HTMLElement>((v) => (opts.ref.current = v));
		$effect(() => {
			const id = this.opts.id.current;
			const value = this.opts.value.current;
			return untrack(() => this.root.registerContent(id, value));
		});
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: 'tabpanel',
				hidden: !this.#isActive ? true : undefined,
				tabindex: 0,
				'data-value': this.opts.value.current,
				'data-state': getTabDataState(this.#isActive),
				'aria-labelledby': this.#ariaLabelledBy,
				'data-orientation': this.root.opts.orientation.current,
				[tabsAttrs.content]: '',
				...this.attachment,
			}) as const,
	);
}

function getTabDataState(condition: boolean): 'active' | 'inactive' {
	return condition ? 'active' : 'inactive';
}
