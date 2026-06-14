<script lang="ts">
	import type { TooltipProviderProps } from '$lib/components/primitive/tooltip/index';
	import { TooltipProviderState } from '$lib/components/primitive/tooltip/tooltip.svelte';

	let {
		children,
		delayDuration = 700,
		disableCloseOnTriggerClick = false,
		disableHoverableContent = false,
		disabled = false,
		ignoreNonKeyboardFocus = false,
		skipDelayDuration = 300,
	}: TooltipProviderProps = $props();

	TooltipProviderState.create({
		delayDuration: {
			get current() {
				return delayDuration;
			},
		},
		disableCloseOnTriggerClick: {
			get current() {
				return disableCloseOnTriggerClick;
			},
		},
		disableHoverableContent: {
			get current() {
				return disableHoverableContent;
			},
		},
		disabled: {
			get current() {
				return disabled;
			},
		},
		ignoreNonKeyboardFocus: {
			get current() {
				return ignoreNonKeyboardFocus;
			},
		},
		skipDelayDuration: {
			get current() {
				return skipDelayDuration;
			},
		},
	});
</script>

{@render children?.()}
