<script lang="ts" module>
	import type { TimeValue } from '$lib/internal/date-time/types.js';
	import type { Time } from '@internationalized/date';
	type T = unknown;
</script>

<script lang="ts" generics="T extends TimeValue = Time">
	import { untrack } from 'svelte';
	import { boxWith } from '$lib/internal/tools/index.js';
	import { TimeFieldRootState } from '../time-field.svelte.js';
	import type { TimeFieldRootProps } from '../types.js';
	import { getDefaultTime } from '$lib/internal/date-time/utils.js';
	import { resolveLocaleProp } from '$lib/components/utilities/config/prop-resolvers.js';

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
	}: TimeFieldRootProps<T> = $props();

	function repairUndefinedControlledPlaceholder() {
		if (placeholder !== undefined) return;

		const defaultPlaceholder = getDefaultTime({
			granularity,
			defaultValue: value,
		});

		placeholder = defaultPlaceholder;
	}

	// SSR/initial setup. Segment state requires a writable TimeValue placeholder.
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

	TimeFieldRootState.create({
		value: boxWith(
			() => value,
			(v) => {
				value = v;
				onValueChange(v);
			},
		),
		placeholder: boxWith(
			() => placeholder as TimeValue,
			(v) => {
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
