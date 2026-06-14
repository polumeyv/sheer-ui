<script lang="ts" module>
	import type { TimeValue } from "$lib/shared/date/types";
	import type { Time } from "@internationalized/date";
	type T = unknown;
</script>

<script lang="ts" generics="T extends TimeValue = Time">import { untrack } from "svelte";
		import { TimeFieldRootState } from "$lib/components/time-field/time-field.svelte";
	import type { TimeFieldRootProps } from "$lib/components/time-field/index";
	import { getDefaultTime } from "$lib/vendor/date-time/utils";
	import { resolveLocaleProp } from "$lib/components/_shared/utilities/config/prop-resolvers";

	let {
		disabled = false,
		granularity,
		hideTimeZone = false,
		hourCycle,
		locale,
		maxValue,
		minValue,
		onPlaceholderChange = (() => {}),
		onValueChange = (() => {}),
		validate = (() => {}),
		onInvalid = (() => {}),
		placeholder = $bindable(),
		value = $bindable(),
		readonly = false,
		readonlySegments = [],
		required = false,
		errorMessageId,
		children,
	}: TimeFieldRootProps<T> = $props();

	function handleDefaultPlaceholder() {
		if (placeholder !== undefined) return;

		const defaultPlaceholder = getDefaultTime({
			granularity,
			defaultValue: value,
		});

		placeholder = defaultPlaceholder;
	}

	// SSR
	handleDefaultPlaceholder();

	/**
	 * Covers an edge case where when a spread props object is reassigned,
	 * the props are reset to their default values, which would make placeholder
	 * undefined which causes errors to be thrown.
	 */
	$effect.pre(() => {
		void (placeholder);
		untrack(() => {
			handleDefaultPlaceholder();
		});
	});

	TimeFieldRootState.create({
		value: { get current() { return value; }, set current(v) { value = v; onValueChange(v); } },
		placeholder: { get current() { return placeholder as TimeValue; }, set current(v) { placeholder = v; onPlaceholderChange(v); } },
		disabled: { get current() { return disabled; } },
		granularity: { get current() { return granularity; } },
		hideTimeZone: { get current() { return hideTimeZone; } },
		hourCycle: { get current() { return hourCycle; } },
		locale: resolveLocaleProp(() => locale),
		maxValue: { get current() { return maxValue; } },
		minValue: { get current() { return minValue; } },
		validate: { get current() { return validate; } },
		readonly: { get current() { return readonly; } },
		readonlySegments: { get current() { return readonlySegments; } },
		required: { get current() { return required; } },
		onInvalid: { get current() { return onInvalid; } },
		errorMessageId: { get current() { return errorMessageId; } },
		isInvalidProp: { get current() { return undefined; } },
	});
</script>

{@render children?.()}
