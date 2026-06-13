<script lang="ts">
	import { boxWith } from '$lib/vendor/toolbelt/index.js';
	import type { TooltipProviderProps } from '$lib/bits/tooltip/types.js';
	import { TooltipProviderState } from '$lib/bits/tooltip/tooltip.svelte.js';

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
		delayDuration: boxWith(() => delayDuration),
		disableCloseOnTriggerClick: boxWith(() => disableCloseOnTriggerClick),
		disableHoverableContent: boxWith(() => disableHoverableContent),
		disabled: boxWith(() => disabled),
		ignoreNonKeyboardFocus: boxWith(() => ignoreNonKeyboardFocus),
		skipDelayDuration: boxWith(() => skipDelayDuration),
	});
</script>

{@render children?.()}
