<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import type { AlertDialogRootProps } from '../types.js';
	import { DialogRootState } from '$lib/components/dialog/dialog.svelte.js';

	let { open = $bindable(false), onOpenChange = () => {}, onOpenChangeComplete = () => {}, children }: AlertDialogRootProps = $props();

	DialogRootState.create({
		variant: boxWith(() => 'alert-dialog'),
		open: boxWith(
			() => open,
			(v) => {
				open = v;
				onOpenChange(v);
			},
		),
		onOpenChangeComplete: boxWith(() => onOpenChangeComplete),
	});
</script>

{@render children?.()}
