<script lang="ts">
	import { join } from 'overrule';
	import type { WithElementRef } from '../../utils.js';
	import type { HTMLOptionAttributes } from 'svelte/elements';
	import CheckIcon from '@lucide/svelte/icons/check';

	let { ref = $bindable(null), class: className, children, ...restProps }: WithElementRef<HTMLOptionAttributes> = $props();
</script>

<option bind:this={ref} data-slot="select-option" class={join('select-option', className)} {...restProps}>
	<span class="select-checkmark">
		<CheckIcon class="size-4" />
	</span>
	{@render children?.()}
</option>
