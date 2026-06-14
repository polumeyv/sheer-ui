<script lang="ts">
import * as DialogPrimitive from './primitive/index';

let { open = $bindable(false), ...restProps }: DialogPrimitive.RootProps = $props();
</script>

<DialogPrimitive.Root bind:open {...restProps} />
