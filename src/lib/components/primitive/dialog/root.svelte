<script lang="ts">
		import { DialogRootState } from '$lib/components/primitive/dialog/dialog.svelte';
	import type { DialogRootProps } from '$lib/components/primitive/dialog/index';

	let {
		open = $bindable(false),
		onOpenChange = (() => {}),
		onOpenChangeComplete = (() => {}),
		variant = 'dialog',
		children,
	}: DialogRootProps & { variant?: 'dialog' | 'alert-dialog' } = $props();

	DialogRootState.create({
		variant: { get current() { return variant; } },
		open: { get current() { return open; }, set current(v) { open = v; onOpenChange(v); } },
		onOpenChangeComplete: { get current() { return onOpenChangeComplete; } },
	});
</script>

{@render children?.()}
