<script lang="ts">
import { Drawer as DrawerPrimitive } from './util/index.js';

let { ...restProps }: DrawerPrimitive.PortalProps = $props();
</script>

<DrawerPrimitive.Portal {...restProps} />
