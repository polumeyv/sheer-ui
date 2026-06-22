<script lang="ts">
	import { watch } from "$lib/internal/toolbelt.js";
	import { boxWith, mergeProps } from "$lib/internal/toolbelt.js";
	import type { DateValue } from "@internationalized/date";
	import { DateRangeFieldRootState } from "../date-range-field.svelte.js";
	import type { DateRangeFieldRootProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";
	import type { DateRange } from "$lib/shared/index.js";
	import { getDefaultDate } from "$lib/internal/date-time/utils.js";
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
	}: DateRangeFieldRootProps = $props();

	let startValue = $state<DateValue | undefined>(value?.start);
	let endValue = $state<DateValue | undefined>(value?.end);

	function repairUndefinedControlledPlaceholder() {
		if (placeholder !== undefined) return;
		const defaultPlaceholder = getDefaultDate({
			granularity,
			defaultValue: value?.start,
			minValue,
			maxValue,
		});
		placeholder = defaultPlaceholder;
	}

	// SSR/initial setup: DateRangeField needs a writable placeholder for segment state.
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

	// SSR/initial setup: range field state owns a DateRange object, even when empty.
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

	const rootState = DateRangeFieldRootState.create({
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
			() => placeholder as DateValue,
			(v) => {
				placeholder = v;
				onPlaceholderChange(v);
			}
		),
		readonlySegments: boxWith(() => readonlySegments),
		value: boxWith(
			() => value as DateRange,
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
