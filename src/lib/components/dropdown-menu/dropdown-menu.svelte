<script lang="ts">
import { DropdownMenu as DropdownMenuPrimitive } from "$lib/components/_shared/primitives";

let { open = $bindable(false), ...restProps }: DropdownMenuPrimitive.RootProps = $props();
</script>

<DropdownMenuPrimitive.Root bind:open {...restProps} />
