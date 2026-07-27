<script lang="ts" module>
	type T = unknown;
</script>

<script lang="ts" generics="T = never">
	import { boxWith } from '../../../internal/tools/index.js';
	import { OpenCell } from '../../../internal/open-cell.svelte.js';
	import type { TooltipRootProps } from '../types.js';
	import { TooltipRootState } from '../tooltip.svelte.js';

	let {
		open = false,
		triggerId = $bindable<string | null>(null),
		state: givenCell,
		onOpenChangeComplete = () => {},
		disabled,
		delayDuration,
		disableCloseOnTriggerClick,
		disableHoverableContent,
		ignoreNonKeyboardFocus,
		tether,
		children,
	}: TooltipRootProps<T> = $props();

	// Cell over the source prop; the engine keeps its boxed-open interface (vendored,
	// ADR 0006) — the box is a bridge over the cell, so the cell owns `open`.
	// svelte-ignore state_referenced_locally
	const cell = givenCell ?? new OpenCell(() => open);

	const rootState = TooltipRootState.create({
		open: boxWith(
			() => cell.open,
			(v) => (cell.open = v),
		),
		triggerId: boxWith(
			() => triggerId,
			(v) => {
				triggerId = v;
			},
		),
		delayDuration: boxWith(() => delayDuration),
		disableCloseOnTriggerClick: boxWith(() => disableCloseOnTriggerClick),
		disableHoverableContent: boxWith(() => disableHoverableContent),
		ignoreNonKeyboardFocus: boxWith(() => ignoreNonKeyboardFocus),
		disabled: boxWith(() => disabled),
		onOpenChangeComplete: boxWith(() => onOpenChangeComplete),
		tether: boxWith(() => tether),
	});
</script>

{@render children?.({
	open: rootState.opts.open.current,
	triggerId: rootState.activeTriggerId,
	payload: rootState.activePayload as [T] extends [never] ? null : T | null,
})}
