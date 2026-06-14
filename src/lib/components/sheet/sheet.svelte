<script lang="ts">
import * as SheetPrimitive from '$lib/components/primitive/dialog/index';

let { open = $bindable(false), ...restProps }: SheetPrimitive.RootProps = $props();
</script>

<SheetPrimitive.Root bind:open {...restProps} />
