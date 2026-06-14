<script lang="ts">
import * as DialogPrimitive from '$lib/components/primitive/dialog/index';

let { ref = $bindable(null), ...restProps }: DialogPrimitive.TriggerProps = $props();
</script>

<DialogPrimitive.Trigger bind:ref data-slot="alert-dialog-trigger" {...restProps} />
