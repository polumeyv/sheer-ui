<script lang="ts">
	import Portal from '$lib/bits/utilities/portal/portal.svelte';
	import type { SelectPortalProps } from '$lib/bits/select/types.js';

	let { ...restProps }: SelectPortalProps = $props();
</script>

<Portal {...restProps} />
