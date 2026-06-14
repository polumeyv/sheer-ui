<script lang="ts">
import { ContextMenu as ContextMenuPrimitive } from "$lib/components/_shared/primitives";

let { open = $bindable(false), ...restProps }: ContextMenuPrimitive.SubProps = $props();
</script>

<ContextMenuPrimitive.Sub bind:open {...restProps} />
