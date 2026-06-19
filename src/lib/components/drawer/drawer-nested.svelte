<script lang="ts">
import { Drawer as DrawerPrimitive } from './util/index.js';

let {
	shouldScaleBackground = true,
	open = $bindable(false),
	activeSnapPoint = $bindable(null),
	...restProps
}: DrawerPrimitive.RootProps = $props();
</script>

<DrawerPrimitive.NestedRoot {shouldScaleBackground} bind:open bind:activeSnapPoint {...restProps} />
