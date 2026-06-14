import { createContext, getContext, hasContext, setContext } from 'svelte';
import type { MenuRootState } from './root.svelte';
import type { MenuMenuState } from './menu.svelte';
import type { MenuContentState } from './content.svelte';
import type { MenuGroupState } from './group.svelte';
import type { MenuRadioGroupState } from './radio.svelte';
import type { MenuCheckboxGroupState } from './checkbox.svelte';

export const [getMenuRootContext, setMenuRootContext] = createContext<MenuRootState>();
export const [getMenuMenuContext, setMenuMenuContext] = createContext<MenuMenuState>();
export const [getMenuContentContext, setMenuContentContext] = createContext<MenuContentState>();
export const [getMenuGroupContext, setMenuGroupContext] = createContext<MenuGroupState | MenuRadioGroupState>();

const menuRadioGroupContextKey = Symbol('Menu.RadioGroup');
export function getMenuRadioGroupContext(): MenuRadioGroupState {
	if (!hasContext(menuRadioGroupContextKey)) throw new Error('Context "Menu.RadioGroup" not found');
	return getContext<MenuRadioGroupState>(menuRadioGroupContextKey);
}
export function getMenuRadioGroupContextOr<T>(fallback: T): MenuRadioGroupState | T {
	return hasContext(menuRadioGroupContextKey) ? getContext<MenuRadioGroupState>(menuRadioGroupContextKey) : fallback;
}
export function setMenuRadioGroupContext(state: MenuRadioGroupState): MenuRadioGroupState {
	return setContext(menuRadioGroupContextKey, state);
}

const menuCheckboxGroupContextKey = Symbol('Menu.CheckboxGroup');
export function getMenuCheckboxGroupContextOr<T>(fallback: T): MenuCheckboxGroupState | T {
	return hasContext(menuCheckboxGroupContextKey) ? getContext<MenuCheckboxGroupState>(menuCheckboxGroupContextKey) : fallback;
}
export function setMenuCheckboxGroupContext(state: MenuCheckboxGroupState): MenuCheckboxGroupState {
	return setContext(menuCheckboxGroupContextKey, state);
}
