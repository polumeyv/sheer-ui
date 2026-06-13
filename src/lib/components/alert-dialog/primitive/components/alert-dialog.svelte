<script lang="ts">
		import type { AlertDialogRootProps } from "$lib/components/alert-dialog/primitive/index.js";
	import { DialogRootState } from "$lib/components/dialog/primitive/dialog.svelte.js";

	let {
		open = $bindable(false),
		onOpenChange = (() => {}),
		onOpenChangeComplete = (() => {}),
		children,
	}: AlertDialogRootProps = $props();

	DialogRootState.create({
		variant: { get current() { return "alert-dialog" as const; } },
		open: { get current() { return open; }, set current(v) { open = v; onOpenChange(v); } },
		onOpenChangeComplete: { get current() { return onOpenChangeComplete; } },
	});
</script>

{@render children?.()}
