<script lang="ts">
import { Menubar as MenubarPrimitive } from '$lib/bits-ui.js';

let { ...restProps }: MenubarPrimitive.MenuProps = $props();
</script>

<MenubarPrimitive.Menu {...restProps} />
