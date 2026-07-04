<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { DialogRootState } from '../dialog.svelte.js';
	import type { DialogRootProps } from '../types.js';

	let { open = $bindable(false), onOpenChange = () => {}, onOpenChangeComplete = () => {}, children }: DialogRootProps = $props();

	DialogRootState.create({
		variant: boxWith(() => 'dialog'),
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
