<script lang="ts">
	import { join } from 'overrule';
	import DialogOverlay from '../../dialog/components/dialog-overlay.svelte';
	import type { DialogOverlayProps } from '../../dialog/types.js';

	let { ref = $bindable(null), class: className, ...restProps }: DialogOverlayProps = $props();
</script>

<DialogOverlay
	bind:ref
	data-slot="sheet-overlay"
	class={join('transition-opacity starting:opacity-0 data-[state=closed]:opacity-0 fixed inset-0 z-50 bg-black/50', className)}
	{...restProps} />
