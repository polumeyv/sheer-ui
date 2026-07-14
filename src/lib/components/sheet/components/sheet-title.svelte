<script lang="ts">
	import { join } from 'overrule';
	import DialogTitle from '../../dialog/components/dialog-title.svelte';
	import type { DialogTitleProps } from '../../dialog/types.js';

	let { ref = $bindable(null), class: className, ...restProps }: DialogTitleProps = $props();
</script>

<DialogTitle bind:ref data-slot="sheet-title" class={join('text-foreground font-semibold', className)} {...restProps} />
