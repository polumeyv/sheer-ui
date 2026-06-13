<script lang="ts">
import { ContextMenu as ContextMenuPrimitive } from '$lib/bits-ui.js';

let { ref = $bindable(null), value = $bindable(''), ...restProps }: ContextMenuPrimitive.RadioGroupProps = $props();
</script>

<ContextMenuPrimitive.RadioGroup
	bind:ref
	bind:value
	data-slot="context-menu-radio-group"
	{...restProps}
/>
