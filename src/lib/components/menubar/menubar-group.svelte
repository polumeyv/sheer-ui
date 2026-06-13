<script lang="ts">
import { Menubar as MenubarPrimitive } from '$lib/bits-ui.js';

let {
	ref = $bindable(null),
	...restProps
}: MenubarPrimitive.GroupProps & {
	inset?: boolean;
} = $props();
</script>

<MenubarPrimitive.Group bind:ref data-slot="menubar-group" {...restProps} />
