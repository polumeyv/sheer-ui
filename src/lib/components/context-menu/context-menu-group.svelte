<script lang="ts">
import { ContextMenu as ContextMenuPrimitive } from "$lib/components/_shared/primitives.js";

let { ref = $bindable(null), ...restProps }: ContextMenuPrimitive.GroupProps = $props();
</script>

<ContextMenuPrimitive.Group bind:ref data-slot="context-menu-group" {...restProps} />
