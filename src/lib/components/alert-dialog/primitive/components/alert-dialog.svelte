<script lang="ts">
	import { boxWith } from "$lib/vendor/toolbelt/index.js";
	import type { AlertDialogRootProps } from "$lib/components/alert-dialog/primitive/index.js";
	import { DialogRootState } from "$lib/components/dialog/primitive/dialog.svelte.js";

	let {
		open = $bindable(false),
		onOpenChange = (() => {}),
		onOpenChangeComplete = (() => {}),
		children,
	}: AlertDialogRootProps = $props();

	DialogRootState.create({
		variant: boxWith(() => "alert-dialog"),
		open: boxWith(
			() => open,
			(v) => {
				open = v;
				onOpenChange(v);
			}
		),
		onOpenChangeComplete: boxWith(() => onOpenChangeComplete),
	});
</script>

{@render children?.()}
