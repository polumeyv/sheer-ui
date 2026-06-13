<script lang="ts" module>
	import type { TimeRange, TimeValue } from "$lib/shared/date/types.js";
	import type { Time } from "@internationalized/date";

	type T = unknown;
</script>

<script lang="ts" generics="T extends TimeValue = Time">import { untrack } from "svelte";
		import { mergeProps } from "$lib/vendor/index.js";
	import { TimeRangeFieldRootState } from "$lib/components/time-range-field/time-range-field.svelte.js";
	import type { TimeRangeFieldRootProps } from "$lib/components/time-range-field/index.js";
	import { createId } from "$lib/internal/create-id.js";
	import { getDefaultTime } from "$lib/internal/date-time/utils.js";
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
	}: TimeRangeFieldRootProps<T> = $props();

	let startValue = $state<T | undefined>(value?.start);
	let endValue = $state<T | undefined>(value?.end);

	function handleDefaultPlaceholder() {
		if (placeholder !== undefined) return;
		const defaultPlaceholder = getDefaultTime({ granularity, defaultValue: value?.start });
		placeholder = defaultPlaceholder;
	}

	// SSR
	handleDefaultPlaceholder();

	$effect.pre(() => {
		void (placeholder);
		untrack(() => {
			handleDefaultPlaceholder();
		});
	});

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
	$effect.pre(() => {
		void (value);
		untrack(() => {
			handleDefaultValue();
		});
	});

	const rootState = TimeRangeFieldRootState.create({
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
		placeholder: { get current() { return placeholder as TimeValue; }, set current(v) { placeholder = v; onPlaceholderChange(v); } },
		readonlySegments: { get current() { return readonlySegments; } },
		value: { get current() { return value as TimeRange<T>; }, set current(v) { value = v; onValueChange(v); } },
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
