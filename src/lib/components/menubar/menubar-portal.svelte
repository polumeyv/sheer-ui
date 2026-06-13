<script lang="ts">
import { Menubar as MenubarPrimitive } from "$lib/components/_shared/primitives.js";

let { ...restProps }: MenubarPrimitive.PortalProps = $props();
</script>

<MenubarPrimitive.Portal {...restProps} />
