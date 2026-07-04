<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { DialogRootState, DialogState } from '../dialog.svelte.js';
	import type { DialogRootProps } from '../types.js';

	let { open = false, onOpenChangeComplete = () => {}, children }: DialogRootProps = $props();

	// Root owns both the machinery and the cell; `open` (the prop) is the cell's
	// derivation source, and the children snippet is the only way the cell leaves.
	const dialog = new DialogState(() => open);
	DialogRootState.create({
		variant: boxWith(() => 'dialog'),
		cell: dialog,
		onOpenChangeComplete: boxWith(() => onOpenChangeComplete),
	});
</script>

{@render children?.(dialog)}
