<script lang="ts">
import * as SheetPrimitive from '../dialog/primitive/index';

let { ...restProps }: SheetPrimitive.PortalProps = $props();
</script>

<SheetPrimitive.Portal {...restProps} />
