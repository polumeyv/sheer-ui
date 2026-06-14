<script lang="ts">
		import type { MenubarMenuProps } from "$lib/components/menubar/primitive/index";
	import { MenubarMenuState } from "$lib/components/menubar/primitive/menubar.svelte";
	import Menu from "$lib/components/_shared/menu/components/menu.svelte";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let { value = createId(uid), onOpenChange = (() => {}), ...restProps }: MenubarMenuProps = $props();

	const menuState = MenubarMenuState.create({
		value: { get current() { return value; } },
		onOpenChange: { get current() { return onOpenChange; } },
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
