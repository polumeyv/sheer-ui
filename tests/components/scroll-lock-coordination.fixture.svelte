<script lang="ts">
	import { untrack } from 'svelte';
	import { BodyScrollLock } from '#lib/internal/body-scroll-lock.svelte.js';
	import { usePreventScroll } from '#lib/internal/vaul/use-prevent-scroll.svelte.js';

	let {
		dialogLocked: initialDialogLocked = false,
		drawerEnabled: initialDrawerEnabled = false,
	}: { dialogLocked?: boolean; drawerEnabled?: boolean } = $props();

	let dialogLocked = $state(initialDialogLocked);
	let drawerEnabled = $state(initialDrawerEnabled);

	export function setDialogLocked(value: boolean) {
		dialogLocked = value;
	}
	export function setDrawerEnabled(value: boolean) {
		drawerEnabled = value;
	}

	// Stands in for Dialog/Sheet/Select/Popover's scroll-lock.svelte, made reactive here (that
	// component only constructs it once, gated on a static prop) so one fixture instance can flip it.
	$effect(() => {
		if (!dialogLocked) return;
		untrack(() => {
			new BodyScrollLock(true);
		});
	});

	// Stands in for Drawer's util/use-drawer-root.svelte.ts call site.
	usePreventScroll({ isDisabled: () => !drawerEnabled });
</script>
