<script lang="ts">
	import { join } from 'overrule';
	import DialogDescription from '../../dialog/components/dialog-description.svelte';
	import type { DialogDescriptionProps } from '../../dialog/types.js';

	let { ref = $bindable(null), class: className, ...restProps }: DialogDescriptionProps = $props();
</script>

<DialogDescription bind:ref data-slot="sheet-description" class={join('text-muted-foreground text-sm', className)} {...restProps} />
