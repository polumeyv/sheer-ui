import { kbd, SELECTION_KEYS } from "$lib/internal/kbd.js";
import type { Direction } from "$lib/internal/index.js";

export type CheckedState = boolean | "indeterminate";

export const SUB_OPEN_KEYS: Record<Direction, string[]> = {
	ltr: [...SELECTION_KEYS, kbd.ARROW_RIGHT],
	rtl: [...SELECTION_KEYS, kbd.ARROW_LEFT],
};
export const SUB_CLOSE_KEYS: Record<Direction, string[]> = {
	ltr: [kbd.ARROW_LEFT],
	rtl: [kbd.ARROW_RIGHT],
};

export function isIndeterminate(checked?: CheckedState): checked is "indeterminate" {
	return checked === "indeterminate";
}

export function getCheckedState(checked: CheckedState) {
	return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}

export function isMouseEvent(event: PointerEvent) {
	return event.pointerType === "mouse";
}
