<script lang="ts">
	import { escapeKeydownAttachment } from '#lib/internal/escape-layer/use-escape-layer.svelte.js';
	import type { EscapeBehaviorType } from '#lib/internal/escape-layer/types.js';

	let {
		aBehavior = 'close',
		bBehavior = 'close',
		aEnabled: initialAEnabled = true,
		bEnabled: initialBEnabled = true,
	}: {
		aBehavior?: EscapeBehaviorType;
		bBehavior?: EscapeBehaviorType;
		aEnabled?: boolean;
		bEnabled?: boolean;
	} = $props();

	let aEnabled = $state(initialAEnabled);
	let bEnabled = $state(initialBEnabled);
	let aCount = $state(0);
	let bCount = $state(0);

	export function setAEnabled(value: boolean) {
		aEnabled = value;
	}
	export function setBEnabled(value: boolean) {
		bEnabled = value;
	}

	const attachA = escapeKeydownAttachment({
		escapeKeydownBehavior: () => aBehavior,
		onEscapeKeydown: () => () => {
			aCount += 1;
		},
		enabled: () => aEnabled,
	});
	const attachB = escapeKeydownAttachment({
		escapeKeydownBehavior: () => bBehavior,
		onEscapeKeydown: () => () => {
			bCount += 1;
		},
		enabled: () => bEnabled,
	});
</script>

<div data-testid="a-count">{aCount}</div>
<div data-testid="b-count">{bCount}</div>
<div data-testid="layer-a" {...attachA}></div>
{#if bEnabled}
	<div data-testid="layer-b" {...attachB}></div>
{/if}
