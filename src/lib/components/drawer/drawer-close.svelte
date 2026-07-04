<script lang="ts">
import { Close, type CloseProps } from '../dialog/index.js';

let { ref = $bindable(null), ...restProps }: CloseProps = $props();
</script>

<Close bind:ref data-slot="drawer-close" {...restProps} />
