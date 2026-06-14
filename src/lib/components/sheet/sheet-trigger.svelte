<script lang="ts">
import * as SheetPrimitive from '$lib/components/primitive/dialog/index';

let { ref = $bindable(null), ...restProps }: SheetPrimitive.TriggerProps = $props();
</script>

<SheetPrimitive.Trigger bind:ref data-slot="sheet-trigger" {...restProps} />
