import { createContext } from "svelte";
import { SIDEBAR_KEYBOARD_SHORTCUT } from './constants';

function isEditableTarget(target: EventTarget | null) {
	if (!(target instanceof Element)) return false;
	return target.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"], [role="textbox"]') !== null;
}

type SidebarStateProps = {
	/**
	 * A getter function that returns the current open state of the sidebar.
	 * We use a getter function here to support `bind:open` on the `Sidebar.Provider`
	 * component.
	 */
	open: () => boolean;

	/**
	 * A function that sets the open state of the sidebar. To support `bind:open`, we need
	 * a source of truth for changing the open state to ensure it will be synced throughout
	 * the sub-components and any `bind:` references.
	 */
	setOpen: (open: boolean) => void;
};

/** Whether the `md:` rule on the desktop panel is in effect: the panel's own display, not an ancestor's. */
export const panelDisplayed = (panel: HTMLElement) => getComputedStyle(panel).display !== 'none';

export class SidebarState {
	readonly props: SidebarStateProps;
	open = $derived.by(() => this.props.open());
	sheetOpen = $state(false);
	/**
	 * The mounted desktop panels (one per Root; a Provider may hold several). CSS displays a panel
	 * or its sheet per viewport, so whether a panel is displayed IS the viewport: a toggle writes
	 * the persisted `open` while it is, and the sheet's bit while it isn't. No media query is read
	 * in JS; the breakpoint lives only in the panel's `md:` classes.
	 */
	readonly desktopPanels = new Set<HTMLElement>();

	constructor(props: SidebarStateProps) {
		this.props = props;
	}

	#onDesktop() {
		for (const panel of this.desktopPanels) return panelDisplayed(panel);
		return true;
	}

	// Event handler to apply to the `<svelte:window>`
	handleShortcutKeydown = (e: KeyboardEvent) => {
		if (e.defaultPrevented || e.repeat || isEditableTarget(e.target)) return;
		if (e.key === SIDEBAR_KEYBOARD_SHORTCUT && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			this.toggle();
		}
	};

	setOpen = (value: boolean) => {
		this.#onDesktop() ? this.props.setOpen(value) : (this.sheetOpen = value);
	};

	toggle = () => {
		this.#onDesktop() ? this.props.setOpen(!this.open) : (this.sheetOpen = !this.sheetOpen);
	};

	closeSheet = () => {
		this.sheetOpen = false;
	};
}

export const [useSidebar, setSidebar] = createContext<SidebarState>();
