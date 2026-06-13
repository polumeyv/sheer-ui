<script lang="ts">
import { DropdownMenu as DropdownMenuPrimitive } from '$lib/bits-ui.js';

let { ref = $bindable(null), ...restProps }: DropdownMenuPrimitive.TriggerProps = $props();
</script>

<DropdownMenuPrimitive.Trigger bind:ref data-slot="dropdown-menu-trigger" {...restProps} />
