<script lang="ts">
	import { Trigger, type TriggerProps } from '../dialog/index.js';

	let { ref = $bindable(null), ...restProps }: TriggerProps = $props();
</script>

<Trigger bind:ref data-slot="drawer-trigger" {...restProps} />
