<script lang="ts">
	import { watch } from "$lib/vendor/watch.svelte.js";
	import { mergeProps } from "$lib/vendor/index.js";
	import type { DateValue } from "@internationalized/date";
	import { DateRangeFieldRootState } from "$lib/components/date-range-field/date-range-field.svelte.js";
	import type { DateRangeFieldRootProps } from "$lib/components/date-range-field/index.js";
	import { createId } from "$lib/internal/create-id.js";
	import type { DateRange } from "$lib/shared/index.js";
	import { getDefaultDate } from "$lib/internal/date-time/utils.js";
	import { resolveLocaleProp } from "$lib/components/_shared/utilities/config/prop-resolvers.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		value = $bindable(),
		onValueChange = (() => {}),
		placeholder = $bindable(),
		onPlaceholderChange = (() => {}),
		disabled = false,
		readonly = false,
		required = false,
		hourCycle,
		granularity,
		locale,
		hideTimeZone = false,
		validate = (() => {}),
		onInvalid = (() => {}),
		maxValue,
		minValue,
		readonlySegments = [],
		children,
		child,
		onStartValueChange = (() => {}),
		onEndValueChange = (() => {}),
		errorMessageId,
		...restProps
	}: DateRangeFieldRootProps = $props();

	let startValue = $state<DateValue | undefined>(value?.start);
	let endValue = $state<DateValue | undefined>(value?.end);

	function handleDefaultPlaceholder() {
		if (placeholder !== undefined) return;
		const defaultPlaceholder = getDefaultDate({
			granularity,
			defaultValue: value?.start,
			minValue,
			maxValue,
		});
		placeholder = defaultPlaceholder;
	}

	// SSR
	handleDefaultPlaceholder();

	watch.pre(
		() => placeholder,
		() => {
			handleDefaultPlaceholder();
		}
	);

	function handleDefaultValue() {
		if (value !== undefined) return;
		const defaultValue = { start: undefined, end: undefined };
		value = defaultValue;
	}

	// SSR
	handleDefaultValue();

	/**
	 * Covers an edge case where when a spread props object is reassigned,
	 * the props are reset to their default values, which would make value
	 * undefined which causes errors to be thrown.
	 */
	watch.pre(
		() => value,
		() => {
			handleDefaultValue();
		}
	);

	const rootState = DateRangeFieldRootState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		disabled: { get current() { return disabled; } },
		readonly: { get current() { return readonly; } },
		required: { get current() { return required; } },
		hourCycle: { get current() { return hourCycle; } },
		granularity: { get current() { return granularity; } },
		locale: resolveLocaleProp(() => locale),
		hideTimeZone: { get current() { return hideTimeZone; } },
		validate: { get current() { return validate; } },
		maxValue: { get current() { return maxValue; } },
		minValue: { get current() { return minValue; } },
		placeholder: { get current() { return placeholder as DateValue; }, set current(v) { placeholder = v; onPlaceholderChange(v); } },
		readonlySegments: { get current() { return readonlySegments; } },
		value: { get current() { return value as DateRange; }, set current(v) { value = v; onValueChange(v); } },
		startValue: { get current() { return startValue; }, set current(v) { startValue = v; onStartValueChange(v); } },
		endValue: { get current() { return endValue; }, set current(v) { endValue = v; onEndValueChange(v); } },
		onInvalid: { get current() { return onInvalid; } },
		errorMessageId: { get current() { return errorMessageId; } },
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
