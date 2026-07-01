import { createContext } from "svelte";
import { SIDEBAR_DESKTOP_MEDIA_QUERY, SIDEBAR_KEYBOARD_SHORTCUT } from './constants';

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
	openMobile = $state(false);
	setOpen: SidebarStateProps['setOpen'];
	state = $derived.by(() => (this.open ? 'expanded' : 'collapsed'));

	constructor(props: SidebarStateProps) {
		this.setOpen = props.setOpen;
		this.props = props;
	}

	// Event handler to apply to the `<svelte:window>`
	handleShortcutKeydown = (e: KeyboardEvent) => {
		if (e.key === SIDEBAR_KEYBOARD_SHORTCUT && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			this.toggleForViewport();
		}
	};

	setOpenMobile = (value: boolean) => {
		this.openMobile = value;
	};

	toggleDesktop = () => {
		this.setOpen(!this.open);
	};

	toggleMobile = () => {
		this.openMobile = !this.openMobile;
	};

	toggleForViewport = () => {
		if (globalThis.matchMedia?.(SIDEBAR_DESKTOP_MEDIA_QUERY).matches) {
			this.toggleDesktop();
		} else {
			this.toggleMobile();
		}
	};

	toggle = () => {
		this.toggleForViewport();
	};
}

export const [useSidebar, setSidebar] = createContext<SidebarState>();
