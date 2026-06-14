<script lang="ts">
import * as SheetPrimitive from '$lib/components/primitive/dialog/index';

let { ...restProps }: SheetPrimitive.PortalProps = $props();
</script>

<SheetPrimitive.Portal {...restProps} />
