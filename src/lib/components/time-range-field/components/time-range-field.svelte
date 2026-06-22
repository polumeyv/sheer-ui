<script lang="ts" module>
	import type { TimeRange, TimeValue } from "$lib/shared/date/types.js";
	import type { Time } from "@internationalized/date";

	type T = unknown;
</script>

<script lang="ts" generics="T extends TimeValue = Time">
	import { watch } from "$lib/internal/toolbelt.js";
	import { boxWith, mergeProps } from "$lib/internal/toolbelt.js";
	import { TimeRangeFieldRootState } from "../time-range-field.svelte.js";
	import type { TimeRangeFieldRootProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";
	import { getDefaultTime } from "$lib/internal/date-time/utils.js";
	import { resolveLocaleProp } from "$lib/components/utilities/config/prop-resolvers.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		value = $bindable(),
		onValueChange = () => {},
		placeholder = $bindable(),
		onPlaceholderChange = () => {},
		disabled = false,
		readonly = false,
		required = false,
		hourCycle,
		granularity,
		locale,
		hideTimeZone = false,
		validate = () => {},
		onInvalid = () => {},
		maxValue,
		minValue,
		readonlySegments = [],
		children,
		child,
		onStartValueChange = () => {},
		onEndValueChange = () => {},
		errorMessageId,
		...restProps
	}: TimeRangeFieldRootProps<T> = $props();

	let startValue = $state<T | undefined>(value?.start);
	let endValue = $state<T | undefined>(value?.end);

	function repairUndefinedControlledPlaceholder() {
		if (placeholder !== undefined) return;
		const defaultPlaceholder = getDefaultTime({ granularity, defaultValue: value?.start });
		placeholder = defaultPlaceholder;
	}

	// SSR/initial setup: TimeRangeField needs a writable placeholder for segment state.
	repairUndefinedControlledPlaceholder();

	watch.pre(
		() => placeholder,
		() => {
			/**
			 * Parent spread-prop resets can make the bindable placeholder undefined again.
			 * Repairing it is intentional: this is writable segment/focus state, and
			 * parents using bind:placeholder should observe the repaired value.
			 */
			repairUndefinedControlledPlaceholder();
		}
	);

	function repairUndefinedControlledValue() {
		if (value !== undefined) return;
		const defaultValue = { start: undefined, end: undefined };
		value = defaultValue;
	}

	// SSR/initial setup: range field state owns a TimeRange object, even when empty.
	repairUndefinedControlledValue();

	watch.pre(
		() => value,
		() => {
			/**
			 * Parent spread-prop resets can make value undefined again. Repairing it
			 * preserves the controlled range object used by the field state machine.
			 */
			repairUndefinedControlledValue();
		}
	);

	const rootState = TimeRangeFieldRootState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		disabled: boxWith(() => disabled),
		readonly: boxWith(() => readonly),
		required: boxWith(() => required),
		hourCycle: boxWith(() => hourCycle),
		granularity: boxWith(() => granularity),
		locale: resolveLocaleProp(() => locale),
		hideTimeZone: boxWith(() => hideTimeZone),
		validate: boxWith(() => validate),
		maxValue: boxWith(() => maxValue),
		minValue: boxWith(() => minValue),
		placeholder: boxWith(
			() => placeholder as TimeValue,
			(v) => {
				placeholder = v;
				onPlaceholderChange(v);
			}
		),
		readonlySegments: boxWith(() => readonlySegments),
		value: boxWith(
			() => value as TimeRange<T>,
			(v) => {
				value = v;
				onValueChange(v);
			}
		),
		startValue: boxWith(
			() => startValue,
			(v) => {
				startValue = v;
				onStartValueChange(v);
			}
		),
		endValue: boxWith(
			() => endValue,
			(v) => {
				endValue = v;
				onEndValueChange(v);
			}
		),
		onInvalid: boxWith(() => onInvalid),
		errorMessageId: boxWith(() => errorMessageId),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
