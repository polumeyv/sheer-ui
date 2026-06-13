<script lang="ts">
import * as DialogPrimitive from '../dialog/primitive/index.js';

let { ref = $bindable(null), ...restProps }: DialogPrimitive.TriggerProps = $props();
</script>

<DialogPrimitive.Trigger bind:ref data-slot="alert-dialog-trigger" {...restProps} />
