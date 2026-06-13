<script lang="ts">
	import Portal from '$lib/components/_shared/utilities/portal/portal.svelte';
	import type { SelectPortalProps } from '$lib/components/select/primitive/types.js';

	let { ...restProps }: SelectPortalProps = $props();
</script>

<Portal {...restProps} />
