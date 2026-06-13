<script lang="ts">
import { DropdownMenu as DropdownMenuPrimitive } from '$lib/bits-ui.js';

let { ref = $bindable(null), value = $bindable([]), ...restProps }: DropdownMenuPrimitive.CheckboxGroupProps = $props();
</script>

<DropdownMenuPrimitive.CheckboxGroup
	bind:ref
	bind:value
	data-slot="dropdown-menu-checkbox-group"
	{...restProps}
/>
