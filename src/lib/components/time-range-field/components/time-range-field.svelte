<script lang="ts" module>
	import type { TimeEndpoints, TimeValue } from '../../../internal/date-time/types.js';
	import type { Time } from '@internationalized/date';
</script>

<script lang="ts" generics="T extends TimeValue = Time">
	import { boxWith, repairBindable } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../merge-props.js';
	import { TimeRangeFieldRootState } from '../time-range-field.svelte.js';
	import type { TimeRangeFieldRootProps } from '../types.js';
	import { createId } from '../../../internal/create-id.js';
	import { getDefaultTime } from '../../../internal/date-time/utils.js';
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
	}: TimeRangeFieldRootProps<T> = $props();

	function repairUndefinedControlledPlaceholder() {
		if (placeholder !== undefined) return;
		const defaultPlaceholder = getDefaultTime({ granularity, defaultValue: value?.start });
		placeholder = defaultPlaceholder;
	}

	// TimeRangeField needs a writable placeholder for segment state.
	repairBindable(() => placeholder, repairUndefinedControlledPlaceholder);

	function repairUndefinedControlledValue() {
		if (value !== undefined) return;
		const defaultValue = { start: undefined, end: undefined };
		value = defaultValue;
	}

	// Range field state owns a TimeEndpoints object, even when empty.
	repairBindable(() => value, repairUndefinedControlledValue);

	const rootState = TimeRangeFieldRootState.create({
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
			() => placeholder as TimeValue,
			(v) => {
				placeholder = v;
				onPlaceholderChange(v);
			},
		),
		readonlySegments: boxWith(() => readonlySegments),
		value: boxWith(
			() => value as TimeEndpoints<T>,
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
