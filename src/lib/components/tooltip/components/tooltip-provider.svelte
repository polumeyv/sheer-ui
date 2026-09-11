<script lang="ts">
	import type { TooltipProviderProps } from '../types.js';
	import { TooltipProviderState } from '../tooltip.svelte.js';

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
		get delayDuration() {
			return delayDuration;
		},
		get disableCloseOnTriggerClick() {
			return disableCloseOnTriggerClick;
		},
		get disableHoverableContent() {
			return disableHoverableContent;
		},
		get disabled() {
			return disabled;
		},
		get ignoreNonKeyboardFocus() {
			return ignoreNonKeyboardFocus;
		},
		get skipDelayDuration() {
			return skipDelayDuration;
		},
	});
</script>

{@render children?.()}
