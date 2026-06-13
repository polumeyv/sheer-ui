<script lang="ts">
	import { boxWith } from "$lib/vendor/toolbelt/index.js";
	import type { EscapeLayerImplProps } from "$lib/components/_shared/utilities/escape-layer/types.js";
	import { EscapeLayerState } from "$lib/components/_shared/utilities/escape-layer/use-escape-layer.svelte.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		escapeKeydownBehavior = "close",
		onEscapeKeydown = noop,
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
