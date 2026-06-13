<script lang="ts">
	import { boxWith } from '$lib/vendor/toolbelt/index.js';
	import { DialogRootState } from '$lib/bits/dialog/dialog.svelte.js';
	import type { DialogRootProps } from '$lib/bits/dialog/types.js';
	import { noop } from '$lib/internal/noop.js';

	let {
		open = $bindable(false),
		onOpenChange = noop,
		onOpenChangeComplete = noop,
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
