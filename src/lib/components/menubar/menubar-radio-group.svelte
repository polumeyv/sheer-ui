<script lang="ts">
import { Menubar as MenubarPrimitive } from "$lib/components/_shared/primitives";

let { ref = $bindable(null), value = $bindable(''), ...restProps }: MenubarPrimitive.RadioGroupProps = $props();
</script>

<MenubarPrimitive.RadioGroup bind:ref bind:value data-slot="menubar-radio-group" {...restProps} />
