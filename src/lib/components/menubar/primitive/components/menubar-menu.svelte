<script lang="ts">
	import { boxWith } from "$lib/vendor/index.js";
	import type { MenubarMenuProps } from "$lib/components/menubar/primitive/index.js";
	import { MenubarMenuState } from "$lib/components/menubar/primitive/menubar.svelte.js";
	import Menu from "$lib/components/_shared/menu/components/menu.svelte";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let { value = createId(uid), onOpenChange = (() => {}), ...restProps }: MenubarMenuProps = $props();

	const menuState = MenubarMenuState.create({
		value: boxWith(() => value),
		onOpenChange: boxWith(() => onOpenChange),
	});
</script>

<Menu
	open={menuState.open}
	onOpenChange={(open) => {
		if (!open) menuState.root.onMenuClose();
	}}
	dir={menuState.root.opts.dir.current}
	_internal_variant="menubar"
	{...restProps}
	_internal_should_skip_exit_animation={() =>
		menuState.root.skipExitAnimationForMenuValue === menuState.opts.value.current}
/>
