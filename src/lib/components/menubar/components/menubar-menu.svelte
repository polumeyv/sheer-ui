<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { OpenCell } from '../../../internal/open-cell.svelte.js';
	import type { MenubarMenuProps } from '../types.js';
	import { MenubarMenuState } from '../menubar.svelte.js';
	import Menu from '../../menu/components/menu.svelte';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let { value = createId(uid), onOpenChange = () => {}, ...restProps }: MenubarMenuProps = $props();

	const menuState = MenubarMenuState.create({
		value: boxWith(() => value),
		onOpenChange: boxWith(() => onOpenChange),
	});

	// Delegate cell: the menubar root is the source of which menu is open; a
	// self-close (Escape / dismiss) inside the menu reports back so the root
	// leaves open-mode. Opens only ever come from the menubar's own triggers.
	const cell = new OpenCell(
		() => menuState.open,
		(open) => {
			if (!open) menuState.root.onMenuClose();
		},
	);
</script>

<Menu
	state={cell}
	dir={menuState.root.opts.dir.current}
	_internal_variant="menubar"
	{...restProps}
	_internal_should_skip_exit_animation={() => menuState.root.skipExitAnimationForMenuValue === menuState.opts.value.current} />
