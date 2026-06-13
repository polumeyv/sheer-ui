<script lang="ts">
import { DropdownMenu as DropdownMenuPrimitive } from '$lib/bits-ui.js';

let { open = $bindable(false), ...restProps }: DropdownMenuPrimitive.RootProps = $props();
</script>

<DropdownMenuPrimitive.Root bind:open {...restProps} />
