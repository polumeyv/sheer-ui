<script lang="ts" module>
	type T = unknown;
</script>

<script lang="ts" generics="T = never">
		import type { TooltipRootProps } from "$lib/components/tooltip/primitive/index.js";
	import { TooltipRootState } from "$lib/components/tooltip/primitive/tooltip.svelte.js";
	import FloatingLayer from "$lib/components/_shared/utilities/floating-layer/components/floating-layer.svelte";

	let {
		open = $bindable(false),
		triggerId = $bindable<string | null>(null),
		onOpenChange = (() => {}),
		onOpenChangeComplete = (() => {}),
		disabled,
		delayDuration,
		disableCloseOnTriggerClick,
		disableHoverableContent,
		ignoreNonKeyboardFocus,
		tether,
		children,
	}: TooltipRootProps<T> = $props();

	const rootState = TooltipRootState.create({
		open: { get current() { return open; }, set current(v) { open = v; onOpenChange(v); } },
		triggerId: { get current() { return triggerId; }, set current(v) { triggerId = v; } },
		delayDuration: { get current() { return delayDuration; } },
		disableCloseOnTriggerClick: { get current() { return disableCloseOnTriggerClick; } },
		disableHoverableContent: { get current() { return disableHoverableContent; } },
		ignoreNonKeyboardFocus: { get current() { return ignoreNonKeyboardFocus; } },
		disabled: { get current() { return disabled; } },
		onOpenChangeComplete: { get current() { return onOpenChangeComplete; } },
		tether: { get current() { return tether; } },
	});
</script>

<FloatingLayer tooltip>
	{@render children?.({
		open: rootState.opts.open.current,
		triggerId: rootState.activeTriggerId,
		payload: rootState.activePayload as [T] extends [never] ? null : T | null,
	})}
</FloatingLayer>
