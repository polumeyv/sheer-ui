import { createContext } from "svelte";
import { isMobile as viewportIsMobile } from '../../hooks/is-mobile.svelte.js';
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

export class SidebarState {
	readonly props: SidebarStateProps;
	open = $derived.by(() => this.props.open());
	#openMobile = $state(false);
	state = $derived.by(() => (this.open ? 'expanded' : 'collapsed'));
	openForViewport = $derived.by(() => (viewportIsMobile.current ? this.#openMobile : this.open));

	constructor(props: SidebarStateProps) {
		this.props = props;
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
		if (viewportIsMobile.current) {
			this.#openMobile = value;
			return;
		}
		this.props.setOpen(value);
	};

	toggle = () => {
		this.setOpen(!this.openForViewport);
	};
}

export const [useSidebar, setSidebar] = createContext<SidebarState>();
