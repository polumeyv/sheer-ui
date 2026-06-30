<script lang="ts">
	import { boxWith } from "../../src/lib/internal/tools/index.js";
	import { FocusScope } from "../../src/lib/components/utilities/focus-scope/focus-scope.svelte.js";

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

	const focusScope = FocusScope.use({
		enabled: boxWith(() => enabled),
		trap: boxWith(() => trapFocus),
		loop: true,
		onOpenAutoFocus: boxWith(() => onOpenAutoFocus),
		onCloseAutoFocus: boxWith(() => onCloseAutoFocus),
		ref: boxWith(
			() => scopeRef,
			(v) => (scopeRef = v),
		),
	});
</script>

<button data-testid="before">Before</button>

{#if renderScope}
	<div bind:this={scopeRef} data-testid="scope" {...focusScope.props}>
		<button data-testid="inside">Inside</button>
	</div>
{/if}
