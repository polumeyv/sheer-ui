<script lang="ts">
import * as SheetPrimitive from '../dialog/primitive/index.js';

let { ref = $bindable(null), ...restProps }: SheetPrimitive.CloseProps = $props();
</script>

<SheetPrimitive.Close bind:ref data-slot="sheet-close" {...restProps} />
