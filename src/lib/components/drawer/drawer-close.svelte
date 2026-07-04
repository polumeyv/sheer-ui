<script lang="ts">
import { Close, type CloseProps } from '../../components/dialog/index.js';

let { ref = $bindable(null), ...restProps }: CloseProps = $props();
</script>

<Close bind:ref data-slot="drawer-close" {...restProps} />
