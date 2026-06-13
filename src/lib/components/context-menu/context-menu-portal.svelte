<script lang="ts">
import { ContextMenu as ContextMenuPrimitive } from '$lib/bits-ui.js';

let { ...restProps }: ContextMenuPrimitive.PortalProps = $props();
</script>

<ContextMenuPrimitive.Portal {...restProps} />
