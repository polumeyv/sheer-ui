<script lang="ts" module>
	type T = unknown;
</script>

<script lang="ts" generics="T = never">
	import { boxWith } from '../../../internal/tools/index.js';
	import type { TooltipRootProps } from '../types.js';
	import { TooltipRootState } from '../tooltip.svelte.js';

	let {
		open = $bindable(false),
		triggerId = $bindable<string | null>(null),
		onOpenChange = () => {},
		onOpenChangeComplete = () => {},
		disabled,
		delayDuration,
		disableCloseOnTriggerClick,
		disableHoverableContent,
		ignoreNonKeyboardFocus,
		tether,
		children,
	}: TooltipRootProps<T> = $props();

	const rootState = TooltipRootState.create({
		open: boxWith(
			() => open,
			(v) => {
				open = v;
				onOpenChange(v);
			},
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
