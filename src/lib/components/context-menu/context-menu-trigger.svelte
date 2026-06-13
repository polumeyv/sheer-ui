<script lang="ts">
import { ContextMenu as ContextMenuPrimitive } from '$lib/bits-ui.js';

let { ref = $bindable(null), ...restProps }: ContextMenuPrimitive.TriggerProps = $props();
</script>

<ContextMenuPrimitive.Trigger bind:ref data-slot="context-menu-trigger" {...restProps} />
