import { getMenuRootContext } from '$lib/components/_shared/menu/context.svelte';
import type { MenuRootState } from '$lib/components/_shared/menu/root.svelte';

export class MenuArrowState {
	static create() {
		return new MenuArrowState(getMenuRootContext());
	}

	readonly root: MenuRootState;

	constructor(root: MenuRootState) {
		this.root = root;
	}

	readonly props = $derived.by(
		() =>
			({
				[this.root.getBitsAttr('arrow')]: '',
			}) as const,
	);
}
