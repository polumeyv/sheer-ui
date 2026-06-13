<script lang="ts">
import { ContextMenu as ContextMenuPrimitive } from "$lib/components/_shared/primitives.js";

let { open = $bindable(false), ...restProps }: ContextMenuPrimitive.RootProps = $props();
</script>

<ContextMenuPrimitive.Root bind:open {...restProps} />
