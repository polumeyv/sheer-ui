<script lang="ts">
		import { DialogRootState } from "$lib/components/dialog/primitive/dialog.svelte";
	import type { DialogRootProps } from "$lib/components/dialog/primitive/index";

	let {
		open = $bindable(false),
		onOpenChange = (() => {}),
		onOpenChangeComplete = (() => {}),
		children,
	}: DialogRootProps = $props();

	DialogRootState.create({
		variant: { get current() { return "dialog" as const; } },
		open: { get current() { return open; }, set current(v) { open = v; onOpenChange(v); } },
		onOpenChangeComplete: { get current() { return onOpenChangeComplete; } },
	});
</script>

{@render children?.()}
