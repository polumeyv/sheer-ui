import { untrack } from 'svelte';
import { type ReadableProps, type WritableProps } from '$lib/vendor/index';
import type { OnChangeFn } from '$lib/vendor/types';
import { PresenceManager } from '$lib/vendor/presence-manager.svelte';
import { getMenuMenuContext, setMenuMenuContext } from '$lib/components/_shared/menu/context.svelte';
import type { MenuRootState } from '$lib/components/_shared/menu/root.svelte';

export interface MenuMenuStateOpts
	extends
		WritableProps<{
			open: boolean;
		}>,
		ReadableProps<{
			onOpenChangeComplete: OnChangeFn<boolean>;
		}> {}

export class MenuMenuState {
	static create(opts: MenuMenuStateOpts, root: MenuRootState) {
		return setMenuMenuContext(new MenuMenuState(opts, root, null));
	}

	readonly opts: MenuMenuStateOpts;
	readonly root: MenuRootState;
	readonly parentMenu: MenuMenuState | null;
	contentId = { get current() { return ''; } };
	contentNode = $state<HTMLElement | null>(null);
	contentPresence: PresenceManager;
	triggerNode = $state<HTMLElement | null>(null);

	constructor(opts: MenuMenuStateOpts, root: MenuRootState, parentMenu: MenuMenuState | null) {
		const self = this;
		this.opts = opts;
		this.root = root;
		this.parentMenu = parentMenu;

		this.contentPresence = new PresenceManager({
			ref: { get current() { return self.contentNode; } },
			open: this.opts.open,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			},
			shouldSkipExitAnimation: () => {
				if (this.root.opts.variant.current !== 'menubar' || this.parentMenu !== null) {
					return false;
				}
				return this.root.opts.shouldSkipExitAnimation?.() ?? false;
			},
		});

		if (parentMenu) {
			$effect(() => {
				void (parentMenu.opts.open.current);
				untrack(() => {
					if (parentMenu.opts.open.current) return;
					this.opts.open.current = false;
				});
			});
		}
	}

	toggleOpen() {
		this.opts.open.current = !this.opts.open.current;
	}

	onOpen() {
		this.opts.open.current = true;
	}

	onClose() {
		this.opts.open.current = false;
	}
}

export class MenuSubmenuState {
	static create(opts: MenuMenuStateOpts) {
		const menu = getMenuMenuContext();
		return setMenuMenuContext(new MenuMenuState(opts, menu.root, menu));
	}
}
