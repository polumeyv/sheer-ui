<script lang="ts">
	import { untrack } from 'svelte';
	import { boxWith } from '../../../internal/tools/index.js';
	import { DateFieldRootState } from '../date-field.svelte.js';
	import type { DateFieldRootProps } from '../types.js';
	import { getDefaultDate } from '../../../internal/date-time/utils.js';
	import { resolveLocaleProp } from '../../../components/utilities/config/prop-resolvers.js';

	let {
		disabled = false,
		granularity,
		hideTimeZone = false,
		hourCycle,
		locale,
		maxValue,
		minValue,
		onPlaceholderChange = () => {},
		onValueChange = () => {},
		validate = () => {},
		onInvalid = () => {},
		placeholder = $bindable(),
		value = $bindable(),
		readonly = false,
		readonlySegments = [],
		required = false,
		errorMessageId,
		children,
	}: DateFieldRootProps = $props();

	function getDefaultPlaceholder() {
		return getDefaultDate({
			granularity,
			defaultValue: value,
			minValue,
			maxValue,
		});
	}

	function repairUndefinedControlledPlaceholder() {
		if (placeholder !== undefined) return placeholder;

		const defaultPlaceholder = getDefaultPlaceholder();
		placeholder = defaultPlaceholder;
		return defaultPlaceholder;
	}

	function readControlledPlaceholder() {
		return placeholder ?? getDefaultPlaceholder();
	}

	// SSR/initial setup. Segment state requires a writable DateValue placeholder.
	repairUndefinedControlledPlaceholder();

	/**
	 * Parent spread-prop resets can make the bindable placeholder undefined again.
	 * Repairing it is intentional: this is writable segment/focus state, and
	 * parents using bind:placeholder should observe the repaired value.
	 */
	$effect.pre(() => {
		placeholder;

		untrack(() => {
			repairUndefinedControlledPlaceholder();
		});
	});

	DateFieldRootState.create({
		value: boxWith(
			() => value,
			(v) => {
				value = v;
				onValueChange(v);
			},
		),
		placeholder: boxWith(
			() => {
				return readControlledPlaceholder();
			},
			(v) => {
				if (v === undefined) return;
				placeholder = v;
				onPlaceholderChange(v);
			},
		),
		disabled: boxWith(() => disabled),
		granularity: boxWith(() => granularity),
		hideTimeZone: boxWith(() => hideTimeZone),
		hourCycle: boxWith(() => hourCycle),
		locale: resolveLocaleProp(() => locale),
		maxValue: boxWith(() => maxValue),
		minValue: boxWith(() => minValue),
		validate: boxWith(() => validate),
		readonly: boxWith(() => readonly),
		readonlySegments: boxWith(() => readonlySegments),
		required: boxWith(() => required),
		onInvalid: boxWith(() => onInvalid),
		errorMessageId: boxWith(() => errorMessageId),
		isInvalidProp: boxWith(() => undefined),
	});
</script>

{@render children?.()}
