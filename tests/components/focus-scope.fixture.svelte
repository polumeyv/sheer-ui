<script lang="ts">
	import { boxWith } from "../../src/lib/internal/tools/index.js";
	import FocusScope from "../../src/lib/components/utilities/focus-scope/focus-scope.svelte";

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

	export function hideScope() {
		renderScope = false;
	}
</script>

<button data-testid="before">Before</button>

{#if renderScope}
	<FocusScope
		ref={boxWith(() => scopeRef)}
		{enabled}
		{trapFocus}
		loop
		{onOpenAutoFocus}
		{onCloseAutoFocus}
	>
		{#snippet focusScope({ props })}
			<div bind:this={scopeRef} data-testid="scope" {...props}>
				<button data-testid="inside">Inside</button>
			</div>
		{/snippet}
	</FocusScope>
{/if}
