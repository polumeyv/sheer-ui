<script lang="ts">
import * as DialogPrimitive from './primitive/index.js';

let { ...restProps }: DialogPrimitive.PortalProps = $props();
</script>

<DialogPrimitive.Portal {...restProps} />
