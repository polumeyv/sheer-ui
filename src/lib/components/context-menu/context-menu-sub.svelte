<script lang="ts">
import { ContextMenu as ContextMenuPrimitive } from '$lib/bits-ui.js';

let { open = $bindable(false), ...restProps }: ContextMenuPrimitive.SubProps = $props();
</script>

<ContextMenuPrimitive.Sub bind:open {...restProps} />
