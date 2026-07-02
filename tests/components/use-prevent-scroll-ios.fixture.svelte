<script lang="ts">
	import { usePreventScroll } from '$lib/components/drawer/util/use-prevent-scroll.svelte.js';

	let { disabled: initialDisabled = false }: { disabled?: boolean } = $props();
	let disabled = $state(initialDisabled);

	usePreventScroll({ isDisabled: () => disabled });

	export function setDisabled(value: boolean) {
		disabled = value;
	}
</script>

<div data-testid="disabled">{disabled}</div>
