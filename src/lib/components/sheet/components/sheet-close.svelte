<script lang="ts">
	import DialogClose from '../../dialog/components/dialog-close.svelte';
	import type { DialogCloseProps } from '../../dialog/types.js';

	let { ref = $bindable(null), ...restProps }: DialogCloseProps = $props();
</script>

<DialogClose bind:ref data-slot="sheet-close" {...restProps} />
