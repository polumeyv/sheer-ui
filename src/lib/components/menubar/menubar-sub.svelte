<script lang="ts">
import { Menubar as MenubarPrimitive } from '$lib/bits-ui.js';

let { open = $bindable(false), ...restProps }: MenubarPrimitive.SubProps = $props();
</script>

<MenubarPrimitive.Sub bind:open {...restProps} />
