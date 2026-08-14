import { kbd, SELECTION_KEYS } from "../../internal/kbd.js";
import type { Direction } from "../../internal/index.js";
import { isHTMLElement } from '../../internal/tools/utils/dom.js';
import type { MenuContentState } from './menu.svelte.js';

export type CheckedState = boolean | "indeterminate";

export const SUB_OPEN_KEYS: Record<Direction, string[]> = {
	ltr: [...SELECTION_KEYS, kbd.ARROW_RIGHT],
	rtl: [...SELECTION_KEYS, kbd.ARROW_LEFT],
};
export const SUB_CLOSE_KEYS: Record<Direction, string[]> = {
	ltr: [kbd.ARROW_LEFT],
	rtl: [kbd.ARROW_RIGHT],
};

export const isIndeterminate = (checked?: CheckedState): checked is "indeterminate" => checked === "indeterminate";

export const getCheckedState = (checked: CheckedState) => isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";

export const isMouseEvent = (event: PointerEvent) => event.pointerType === "mouse";

type SubmenuHandlerOptions = {
	onInteractOutside: () => (event: PointerEvent) => void;
	onEscapeKeydown: () => (event: KeyboardEvent) => void;
	onFocusOutside: () => (event: FocusEvent) => void;
};

export function createSubmenuHandlers(state: MenuContentState, options: SubmenuHandlerOptions) {
	const onkeydown = (event: KeyboardEvent) => {
		const inside = (event.currentTarget as HTMLElement).contains(event.target as HTMLElement);
		const closeKey = SUB_CLOSE_KEYS[state.parentMenu.root.opts.dir.current].includes(event.key);
		if (!inside || !closeKey) return;
		state.parentMenu.onClose();
		state.parentMenu.triggerNode?.focus();
		event.preventDefault();
	};

	const handleInteractOutside = (event: PointerEvent) => {
		options.onInteractOutside()(event);
		if (!event.defaultPrevented) state.parentMenu.onClose();
	};

	const handleEscapeKeydown = (event: KeyboardEvent) => {
		options.onEscapeKeydown()(event);
		if (!event.defaultPrevented) state.parentMenu.onClose();
	};

	const handleOnFocusOutside = (event: FocusEvent) => {
		options.onFocusOutside()(event);
		if (event.defaultPrevented || !isHTMLElement(event.target)) return;
		if (event.target.id === state.parentMenu.triggerNode?.id) return;
		const parentContent = state.parentMenu.parentMenu?.contentNode;
		if (parentContent?.contains(event.target)) {
			state.parentMenu.onClose();
			event.preventDefault();
			return;
		}
		const subContentSelector = `[${state.parentMenu.root.getBitsAttr('sub-content')}]`;
		if (event.target.closest(subContentSelector)) {
			event.preventDefault();
			return;
		}
		state.parentMenu.onClose();
	};

	return { onkeydown, handleInteractOutside, handleEscapeKeydown, handleOnFocusOutside };
}
