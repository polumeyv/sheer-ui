<script lang="ts">
	import DialogTrigger from '../../dialog/components/dialog-trigger.svelte';
	import type { DialogTriggerProps } from '../../dialog/types.js';

	let { ref = $bindable(null), ...restProps }: DialogTriggerProps = $props();
</script>

<DialogTrigger bind:ref data-slot="sheet-trigger" {...restProps} />
