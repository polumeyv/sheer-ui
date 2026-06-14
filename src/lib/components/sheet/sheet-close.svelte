<script lang="ts">
import * as SheetPrimitive from '$lib/components/primitive/dialog/index';

let { ref = $bindable(null), ...restProps }: SheetPrimitive.CloseProps = $props();
</script>

<SheetPrimitive.Close bind:ref data-slot="sheet-close" {...restProps} />
