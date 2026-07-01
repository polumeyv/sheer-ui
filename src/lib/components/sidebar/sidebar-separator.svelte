<script lang="ts">
	import { join } from 'overrule';
	import { Separator } from '../separator';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), class: className, ...restProps }: ComponentProps<typeof Separator> = $props();
</script>

<Separator bind:ref data-slot="sidebar-separator" data-sidebar="separator" class={join('bg-sidebar-border', className)} {...restProps} />
