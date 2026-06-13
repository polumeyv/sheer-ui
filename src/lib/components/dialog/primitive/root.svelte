<script lang="ts">
	import { boxWith } from '$lib/vendor/toolbelt/index.js';
	import { DialogRootState } from '$lib/components/dialog/primitive/dialog.svelte.js';
	import type { DialogRootProps } from '$lib/components/dialog/primitive/index.js';

	let {
		open = $bindable(false),
		onOpenChange = (() => {}),
		onOpenChangeComplete = (() => {}),
		variant = 'dialog',
		children,
	}: DialogRootProps & { variant?: 'dialog' | 'alert-dialog' } = $props();

	DialogRootState.create({
		variant: boxWith(() => variant),
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
