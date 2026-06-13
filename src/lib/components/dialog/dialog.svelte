<script lang="ts">
import * as DialogPrimitive from './primitive/index.js';

let { open = $bindable(false), ...restProps }: DialogPrimitive.RootProps = $props();
</script>

<DialogPrimitive.Root bind:open {...restProps} />
