<script lang="ts">
	import { boxWith, repairBindable } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../merge-props.js';
	import type { DateValue } from '@internationalized/date';
	import { DateRangeFieldRootState } from '../date-range-field.svelte.js';
	import type { DateRangeFieldRootProps } from '../types.js';
	import { createId } from '../../../internal/create-id.js';
	import type { DateRange } from '../../../internal/index.js';
	import { getDefaultDate } from '../../../internal/date-time/utils.js';
	import { resolveLocaleProp } from '../../../components/utilities/config/prop-resolvers.js';

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
		errorMessageId,
		...restProps
	}: DateRangeFieldRootProps = $props();

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

	// DateRangeField needs a writable placeholder for segment state.
	repairBindable(() => placeholder, repairUndefinedControlledPlaceholder);

	function repairUndefinedControlledValue() {
		if (value !== undefined) return;
		const defaultValue = { start: undefined, end: undefined };
		value = defaultValue;
	}

	// Range field state owns a DateRange object, even when empty.
	repairBindable(() => value, repairUndefinedControlledValue);

	const rootState = DateRangeFieldRootState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
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
			},
		),
		readonlySegments: boxWith(() => readonlySegments),
		value: boxWith(
			() => value as DateRange,
			(v) => {
				value = v;
				onValueChange(v);
			},
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
