<script lang="ts">
import { DropdownMenu as DropdownMenuPrimitive } from '$lib/bits-ui.js';

let { open = $bindable(false), ...restProps }: DropdownMenuPrimitive.SubProps = $props();
</script>

<DropdownMenuPrimitive.Sub bind:open {...restProps} />
