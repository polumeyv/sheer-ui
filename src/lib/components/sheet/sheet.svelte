<script lang="ts">
import * as SheetPrimitive from '../dialog/primitive/index.js';

let { open = $bindable(false), ...restProps }: SheetPrimitive.RootProps = $props();
</script>

<SheetPrimitive.Root bind:open {...restProps} />
