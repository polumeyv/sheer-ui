<script lang="ts">
import { DropdownMenu as DropdownMenuPrimitive } from '$lib/bits-ui.js';

let { ref = $bindable(null), ...restProps }: DropdownMenuPrimitive.GroupProps = $props();
</script>

<DropdownMenuPrimitive.Group bind:ref data-slot="dropdown-menu-group" {...restProps} />
