<script lang="ts">
	import type { EscapeLayerImplProps } from '$lib/components/_shared/utilities/escape-layer/index';
	import { EscapeLayerState } from '$lib/components/_shared/utilities/escape-layer/use-escape-layer.svelte';

	let { escapeKeydownBehavior = 'close', onEscapeKeydown = () => {}, children, enabled, ref }: EscapeLayerImplProps = $props();

	EscapeLayerState.create({
		escapeKeydownBehavior: {
			get current() {
				return escapeKeydownBehavior;
			},
		},
		onEscapeKeydown: {
			get current() {
				return onEscapeKeydown;
			},
		},
		enabled: {
			get current() {
				return enabled;
			},
		},
		ref,
	});
</script>

{@render children?.()}
