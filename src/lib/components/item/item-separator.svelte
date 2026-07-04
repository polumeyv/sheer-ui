<script lang="ts">
	import { join } from 'overrule';
	import { Separator } from '../separator/index.js';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), class: className, ...restProps }: ComponentProps<typeof Separator> = $props();
</script>

<Separator bind:ref data-slot="item-separator" orientation="horizontal" class={join('my-2', className)} {...restProps} />
