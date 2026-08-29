<script lang="ts">
	import { join } from 'overrule';
	import type { CollapsibleTriggerProps } from '../types.js';

	let { class: className, ref = $bindable(null), children, ...restProps }: CollapsibleTriggerProps = $props();
</script>

<summary
	{...restProps}
	data-slot="collapsible-trigger"
	class={join('cursor-pointer list-none marker:hidden', className)}
	bind:this={ref}>
	{@render children?.()}
</summary>
