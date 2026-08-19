<script lang="ts">
	import { Typeahead, textContentOf } from '#lib/internal/typeahead.svelte.js';

	const labels = ['Apple', 'Apricot', 'Banana'];

	let matchedLabel = $state('');
	let matchedNode = $state<HTMLElement | null>(null);
	let list = $state<HTMLElement | null>(null);

	const labelTypeahead = new Typeahead<string>({
		getSearchText: (label) => label,
		getCurrentCandidate: () => matchedLabel,
		onMatch: (label) => (matchedLabel = label),
		getWindow: () => window,
	});

	const nodeTypeahead = new Typeahead<HTMLElement>({
		getSearchText: textContentOf,
		getCurrentCandidate: () => matchedNode,
		onMatch: (node) => (matchedNode = node),
		getWindow: () => window,
	});

	export function typeLabel(key: string) {
		return labelTypeahead.handleKey(key, labels);
	}

	export function typeNode(key: string) {
		return nodeTypeahead.handleKey(key, Array.from(list?.querySelectorAll<HTMLElement>('button') ?? []));
	}

	export function resetLabels() {
		labelTypeahead.reset();
	}

	export function labelSearch() {
		return labelTypeahead.search;
	}
</script>

<output data-testid="matched-label">{matchedLabel}</output>
<output data-testid="matched-node">{matchedNode ? textContentOf(matchedNode) : ''}</output>
<div bind:this={list}>
	{#each labels as label (label)}
		<button>{` ${label} `}</button>
	{/each}
</div>
