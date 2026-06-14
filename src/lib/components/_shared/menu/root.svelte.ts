import { type ReadableProps } from '$lib/vendor/index';
import type { AnyFn } from '$lib/vendor/types';
import type { Direction } from '$lib/shared/index';
import { IsUsingKeyboard } from '$lib/components/_shared/utilities/is-using-keyboard/is-using-keyboard.svelte';
import { menuAttrs, type MenuVariant } from '$lib/components/_shared/menu/attrs';
import { setMenuRootContext } from '$lib/components/_shared/menu/context.svelte';

export interface MenuRootStateOpts extends ReadableProps<{
	dir: Direction;
	variant: MenuVariant;
	// debugMode: boolean;
}> {
	onClose: AnyFn;
	/** When closing, if this returns true, exit animations are skipped (instant unmount). */
	shouldSkipExitAnimation?: () => boolean;
}

export class MenuRootState {
	static create(opts: MenuRootStateOpts) {
		const root = new MenuRootState(opts);
		return setMenuRootContext(root);
	}

	readonly opts: MenuRootStateOpts;
	readonly isUsingKeyboard = new IsUsingKeyboard();
	ignoreCloseAutoFocus = $state(false);
	isPointerInTransit = $state(false);

	constructor(opts: MenuRootStateOpts) {
		this.opts = opts;
	}

	getBitsAttr: typeof menuAttrs.getAttr = (part) => {
		return menuAttrs.getAttr(part, this.opts.variant.current);
	};
}
