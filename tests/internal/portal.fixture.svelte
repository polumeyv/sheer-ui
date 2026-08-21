<script lang="ts">
	import Portal from '../../src/lib/internal/portal/portal.svelte';
	import type { PortalTarget } from '../../src/lib/internal/portal/portal.svelte';

	let {
		to: initialTo,
		disabled = false,
	}: { to?: PortalTarget; disabled?: boolean } = $props();

	let to = $state(initialTo);

	export function setTo(next: PortalTarget) {
		to = next;
	}
</script>

<Portal {to} {disabled}>
	<span data-testid="portaled">content</span>
</Portal>
