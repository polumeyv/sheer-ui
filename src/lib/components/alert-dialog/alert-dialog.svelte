<script lang="ts">
import * as DialogPrimitive from '../dialog/primitive/index.js';
import type { AlertDialogRootProps } from '$lib/components/alert-dialog/primitive/types.js';

let { open = $bindable(false), ...restProps }: AlertDialogRootProps = $props();
</script>

<DialogPrimitive.Root variant="alert-dialog" bind:open {...restProps} />
