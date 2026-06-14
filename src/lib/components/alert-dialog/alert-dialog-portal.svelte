<script lang="ts">
import * as DialogPrimitive from '../dialog/primitive/index';

let { ...restProps }: DialogPrimitive.PortalProps = $props();
</script>

<DialogPrimitive.Portal {...restProps} />
