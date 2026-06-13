<script lang="ts">
import { Menubar as MenubarPrimitive } from '$lib/bits-ui.js';

let { ...restProps }: MenubarPrimitive.PortalProps = $props();
</script>

<MenubarPrimitive.Portal {...restProps} />
