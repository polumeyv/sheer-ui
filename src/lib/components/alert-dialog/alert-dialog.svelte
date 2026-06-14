<script lang="ts">
import * as DialogPrimitive from '$lib/components/primitive/dialog/index';
import type { AlertDialogRootProps } from '$lib/components/primitive/dialog/index';

let { open = $bindable(false), ...restProps }: AlertDialogRootProps = $props();
</script>

<DialogPrimitive.Root variant="alert-dialog" bind:open {...restProps} />
