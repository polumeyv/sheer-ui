<script lang="ts">
	import { ContentStatic } from "../../src/lib/internal/floating-layer/components/index.js";

	let { onPlaced }: { onPlaced?: () => void } = $props();

	let label = $state("first");

	export function relabel() {
		label = "second";
	}
</script>

{#snippet content({ props }: { props: Record<string, unknown> })}
	<div {...props} data-testid="static-content" data-label={label}></div>
{/snippet}

<ContentStatic {content} {onPlaced} />
