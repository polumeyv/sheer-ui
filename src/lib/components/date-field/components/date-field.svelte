<script lang="ts">import { untrack } from "svelte";
		import { DateFieldRootState } from "$lib/components/date-field/date-field.svelte.js";
	import type { DateFieldRootProps } from "$lib/components/date-field/index.js";
	import { getDefaultDate } from "$lib/internal/date-time/utils.js";
	import { resolveLocaleProp } from "$lib/components/_shared/utilities/config/prop-resolvers.js";

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
	}: DateFieldRootProps = $props();

	function handleDefaultPlaceholder(setPlaceholder = true) {
		if (placeholder !== undefined) return placeholder;

		const defaultPlaceholder = getDefaultDate({
			granularity,
			defaultValue: value,
			minValue,
			maxValue,
		});

		if (setPlaceholder) {
			placeholder = defaultPlaceholder;
		}

		return defaultPlaceholder;
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

	DateFieldRootState.create({
		value: { get current() { return value; }, set current(v) { value = v; onValueChange(v); } },
		placeholder: { get current() { if (placeholder === undefined) return handleDefaultPlaceholder(false); return placeholder; }, set current(v) { if (v === undefined) return; placeholder = v; onPlaceholderChange(v); } },
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
