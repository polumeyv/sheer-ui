<script lang="ts">
	import Portal from '$lib/bits/utilities/portal/portal.svelte';
	import type { PortalProps } from '$lib/bits/utilities/portal/types.js';

	let { ...restProps }: PortalProps = $props();
</script>

<Portal {...restProps} />
