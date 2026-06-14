<script lang="ts">
	import Portal from '$lib/components/_shared/utilities/portal/portal.svelte';
	import type { PortalProps } from '$lib/components/_shared/utilities/portal/index';

	let { ...restProps }: PortalProps = $props();
</script>

<Portal {...restProps} />
