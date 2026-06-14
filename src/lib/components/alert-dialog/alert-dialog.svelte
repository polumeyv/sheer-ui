<script lang="ts">
import * as DialogPrimitive from '../dialog/primitive/index';
import type { AlertDialogRootProps } from '$lib/components/alert-dialog/primitive/index';

let { open = $bindable(false), ...restProps }: AlertDialogRootProps = $props();
</script>

<DialogPrimitive.Root variant="alert-dialog" bind:open {...restProps} />
