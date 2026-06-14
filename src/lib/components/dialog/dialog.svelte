<script lang="ts">
import * as DialogPrimitive from '$lib/components/primitive/dialog/index';

let { open = $bindable(false), ...restProps }: DialogPrimitive.RootProps = $props();
</script>

<DialogPrimitive.Root bind:open {...restProps} />
