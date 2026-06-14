<script lang="ts">
import * as DialogPrimitive from '$lib/components/primitive/dialog/index';

let { ref = $bindable(null), ...restProps }: DialogPrimitive.CloseProps = $props();
</script>

<DialogPrimitive.Close bind:ref data-slot="dialog-close" {...restProps} />
