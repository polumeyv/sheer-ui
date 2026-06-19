<script lang="ts">
import { Drawer as DrawerPrimitive } from './util/index.js';

let { ref = $bindable(null), ...restProps }: DrawerPrimitive.CloseProps = $props();
</script>

<DrawerPrimitive.Close bind:ref data-slot="drawer-close" {...restProps} />
