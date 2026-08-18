<script lang="ts">
	import { Pane, PaneGroup, PaneResizer } from '../../src/lib/internal/paneforge/index.js';

	let group = $state<ReturnType<typeof PaneGroup> | null>(null);
	let showThird = $state(false);

	export function addThirdPane() {
		showThird = true;
	}

	export function getLayout() {
		return group?.getLayout() ?? [];
	}
</script>

<PaneGroup bind:this={group} direction="horizontal">
	<Pane collapsible collapsedSize={5} minSize={10} data-testid="pane-a">a</Pane>
	<PaneResizer data-testid="handle-a" />
	<Pane collapsible collapsedSize={5} minSize={10} data-testid="pane-b">b</Pane>
	{#if showThird}
		<PaneResizer data-testid="handle-b" />
		<Pane minSize={10} data-testid="pane-c">c</Pane>
	{/if}
</PaneGroup>
