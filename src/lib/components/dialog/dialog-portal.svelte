<script lang="ts">
import * as DialogPrimitive from '$lib/components/primitive/dialog/index';

let { ...restProps }: DialogPrimitive.PortalProps = $props();
</script>

<DialogPrimitive.Portal {...restProps} />
