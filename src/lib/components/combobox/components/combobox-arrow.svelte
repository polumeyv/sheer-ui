<script lang="ts">
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import type { ComboboxArrowProps } from '../types.js';

	let { class: className = 'size-4', ...restProps }: ComboboxArrowProps = $props();
</script>

<ChevronsUpDownIcon class={className} {...restProps} />
