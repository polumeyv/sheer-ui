<script lang="ts" module>
	type T = unknown;
</script>

<script lang="ts" generics="T = never">
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

	// svelte-ignore state_referenced_locally
	const cell = givenCell ?? new OpenCell(() => open);

	const rootState = TooltipRootState.create({
		get open() {
			return cell.open;
		},
		set open(v) {
			cell.open = v;
		},
		get triggerId() {
			return triggerId;
		},
		set triggerId(v) {
			triggerId = v;
		},
		get delayDuration() {
			return delayDuration;
		},
		get disableCloseOnTriggerClick() {
			return disableCloseOnTriggerClick;
		},
		get disableHoverableContent() {
			return disableHoverableContent;
		},
		get ignoreNonKeyboardFocus() {
			return ignoreNonKeyboardFocus;
		},
		get disabled() {
			return disabled;
		},
		get onOpenChangeComplete() {
			return onOpenChangeComplete;
		},
		get tether() {
			return tether;
		},
	});
</script>

{@render children?.({
	open: rootState.opts.open,
	triggerId: rootState.activeTriggerId,
	payload: rootState.activePayload as [T] extends [never] ? null : T | null,
})}
