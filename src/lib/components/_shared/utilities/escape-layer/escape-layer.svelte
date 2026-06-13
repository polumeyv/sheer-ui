<script lang="ts">
	import { boxWith } from "$lib/vendor/index.js";
	import type { EscapeLayerImplProps } from "$lib/components/_shared/utilities/escape-layer/index.js";
	import { EscapeLayerState } from "$lib/components/_shared/utilities/escape-layer/use-escape-layer.svelte.js";

	let {
		escapeKeydownBehavior = "close",
		onEscapeKeydown = (() => {}),
		children,
		enabled,
		ref,
	}: EscapeLayerImplProps = $props();

	EscapeLayerState.create({
		escapeKeydownBehavior: boxWith(() => escapeKeydownBehavior),
		onEscapeKeydown: boxWith(() => onEscapeKeydown),
		enabled: boxWith(() => enabled),
		ref,
	});
</script>

{@render children?.()}
