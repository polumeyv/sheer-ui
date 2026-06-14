<script lang="ts">
import { DropdownMenu as DropdownMenuPrimitive } from "$lib/components/_shared/primitives";

let { ...restProps }: DropdownMenuPrimitive.PortalProps = $props();
</script>

<DropdownMenuPrimitive.Portal {...restProps} />
