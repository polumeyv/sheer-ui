<script lang="ts">
	import { createFocusScopeProps } from "../../src/lib/components/utilities/focus-scope/focus-scope.svelte.js";

	let {
		enabled = $bindable(true),
		trapFocus = false,
		onOpenAutoFocus = () => {},
		onCloseAutoFocus = () => {},
	}: {
		enabled?: boolean;
		trapFocus?: boolean;
		onOpenAutoFocus?: (event: Event) => void;
		onCloseAutoFocus?: (event: Event) => void;
	} = $props();

	let scopeRef = $state<HTMLElement | null>(null);
	let renderScope = $state(true);

	export function setEnabled(next: boolean) {
		enabled = next;
	}

	export function setTrapFocus(next: boolean) {
		trapFocus = next;
	}

	export function hideScope() {
		renderScope = false;
	}

	const focusScope = createFocusScopeProps({
		enabled: () => enabled,
		trap: () => trapFocus,
		loop: () => true,
		onOpenAutoFocus: () => onOpenAutoFocus,
		onCloseAutoFocus: () => onCloseAutoFocus,
	});
</script>

<button data-testid="before">Before</button>

{#if renderScope}
	<div bind:this={scopeRef} data-testid="scope" {...focusScope.props}>
		<button data-testid="inside">Inside</button>
	</div>
{/if}
