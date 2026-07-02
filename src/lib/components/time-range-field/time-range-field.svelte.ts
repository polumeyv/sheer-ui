import type { Time } from '@internationalized/date';
import { boxWith, attachRef, DOMContext, type ReadableBoxedValues, type WritableBoxedValues } from '$lib/internal/tools/index.js';
import { createContext, onMount, untrack } from 'svelte';
import { TimeFieldRootState } from '$lib/components/time-field/time-field.svelte.js';
import { TimeFieldInputState } from '$lib/components/time-field/time-field.svelte.js';
import { useId } from '$lib/internal/use-id.js';
import type { TimeSegmentPart } from '$lib/internal/index.js';
import type { RefAttachment, WithRefOpts } from '$lib/internal/types.js';
import { createBitsAttrs, boolToEmptyStrOrUndef } from '$lib/internal/attrs.js';
import type { TimeGranularity, TimeOnInvalid, TimeRange, TimeRangeValidator, TimeValue } from '$lib/internal/date-time/types.js';
import { type TimeFormatter, createTimeFormatter } from '$lib/internal/date-time/formatter.js';
import { getFirstSegment } from '$lib/internal/date-time/field/segments.js';
import { convertTimeValueToTime, isTimeBefore } from '$lib/internal/date-time/field/time-helpers.js';

export const timeRangeFieldAttrs = createBitsAttrs({
	component: 'time-range-field',
	parts: ['root', 'label'],
});

export const [getTimeRangeFieldRoot, setTimeRangeFieldRoot] = createContext<TimeRangeFieldRootState>();

interface TimeRangeFieldRootStateOpts<T extends TimeValue = Time>
	extends
		WithRefOpts,
		WritableBoxedValues<{
			value: TimeRange<T>;
			placeholder: TimeValue;
		}>,
		ReadableBoxedValues<{
			readonlySegments: TimeSegmentPart[];
			validate: TimeRangeValidator<T> | undefined;
			onInvalid: TimeOnInvalid | undefined;
			minValue: TimeValue | undefined;
			maxValue: TimeValue | undefined;
			disabled: boolean;
			readonly: boolean;
			granularity: TimeGranularity | undefined;
			hourCycle: 12 | 24 | undefined;
			locale: string;
			hideTimeZone: boolean;
			required: boolean;
			errorMessageId: string | undefined;
		}> {}

export class TimeRangeFieldRootState<T extends TimeValue = Time> {
	static create<T extends TimeValue = Time>(opts: TimeRangeFieldRootStateOpts<T>) {
		return setTimeRangeFieldRoot(new TimeRangeFieldRootState(opts) as unknown as TimeRangeFieldRootState);
	}
	readonly opts: TimeRangeFieldRootStateOpts<T>;
	readonly attachment: RefAttachment;
	startFieldState: TimeFieldRootState | undefined = undefined;
	endFieldState: TimeFieldRootState | undefined = undefined;
	descriptionId = useId();
	formatter: TimeFormatter;
	fieldNode = $state<HTMLElement | null>(null);
	labelNode = $state<HTMLElement | null>(null);
	descriptionNode = $state<HTMLElement | null>(null);
	/** Per-side values derive from the bound range; a child-field write overrides until the range recommits. */
	startValue = $derived(this.opts.value.current?.start);
	endValue = $derived(this.opts.value.current?.end);
	readonly startValueComplete = $derived.by(() => this.startValue !== undefined);
	readonly endValueComplete = $derived.by(() => this.endValue !== undefined);
	readonly rangeComplete = $derived(this.startValueComplete && this.endValueComplete);

	readonly startValueTime = $derived.by(() => {
		if (!this.startValue) return undefined;
		return convertTimeValueToTime(this.startValue);
	});

	readonly endValueTime = $derived.by(() => {
		if (!this.endValue) return undefined;
		return convertTimeValueToTime(this.endValue);
	});

	readonly minValueTime = $derived.by(() => {
		if (!this.opts.minValue.current) return undefined;
		return convertTimeValueToTime(this.opts.minValue.current);
	});

	readonly maxValueTime = $derived.by(() => {
		if (!this.opts.maxValue.current) return undefined;
		return convertTimeValueToTime(this.opts.maxValue.current);
	});
	domContext: DOMContext;

	constructor(opts: TimeRangeFieldRootStateOpts<T>) {
		this.opts = opts;
		this.formatter = createTimeFormatter(this.opts.locale.current);
		this.domContext = new DOMContext(this.opts.ref);
		this.attachment = attachRef(this.opts.ref, (v) => (this.fieldNode = v));
		onMount(() => () => {
			this.domContext.getDocument().getElementById(this.descriptionId)?.remove();
		});

		$effect(() => {
			if (this.formatter.getLocale() === this.opts.locale.current) return;
			this.formatter.setLocale(this.opts.locale.current);
		});

		// Keep the placeholder on the committed start so both fields render segments around it.
		$effect(() => {
			const start = this.opts.value.current?.start;
			untrack(() => {
				if (start && this.opts.placeholder.current !== start) {
					this.opts.placeholder.current = start;
				}
			});
		});
	}

	/** Box for a child field's value: reads the derived side; writes override it and recommit the range. */
	sideValueBox(type: 'start' | 'end') {
		return boxWith(
			() => (type === 'start' ? this.startValue : this.endValue),
			(v: T | undefined) => {
				if (type === 'start') this.startValue = v;
				else this.endValue = v;
				this.#commitSides();
			},
		);
	}

	/** Child-field write: commit when both sides are set, clear a committed range when one side empties. */
	#commitSides() {
		const start = this.startValue;
		const end = this.endValue;
		const value = this.opts.value.current;
		if (start !== undefined && end !== undefined) {
			if (value?.start !== start || value?.end !== end) {
				this.#updateValue(() => ({ start, end }));
			}
		} else if (value?.start !== undefined && value?.end !== undefined) {
			this.#updateValue(() => ({ start: undefined, end: undefined }));
		}
	}

	readonly validationStatus = $derived.by(() => {
		const value = this.opts.value.current;
		if (value === undefined) return false as const;
		if (value.start === undefined || value.end === undefined) return false as const;

		const msg = this.opts.validate.current?.({
			start: value.start,
			end: value.end,
		});

		if (msg) {
			return {
				reason: 'custom',
				message: msg,
			} as const;
		}

		if (this.minValueTime && this.startValueTime && isTimeBefore(this.startValueTime, this.minValueTime)) {
			return {
				reason: 'min',
			} as const;
		}

		if (this.maxValueTime && this.endValueTime && isTimeBefore(this.maxValueTime, this.endValueTime)) {
			return {
				reason: 'max',
			} as const;
		}

		return false as const;
	});

	readonly isInvalid = $derived.by(() => {
		if (this.validationStatus === false) return false;
		return true;
	});

	#updateValue(cb: (value: TimeRange<T>) => TimeRange<T>) {
		const value = this.opts.value.current;
		const newValue = cb(value);
		this.opts.value.current = newValue;
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: 'group',
				[timeRangeFieldAttrs.root]: '',
				'data-invalid': boolToEmptyStrOrUndef(this.isInvalid),
				...this.attachment,
			}) as const,
	);
}

interface TimeRangeFieldLabelStateOpts extends WithRefOpts {}

export class TimeRangeFieldLabelState {
	static create(opts: TimeRangeFieldLabelStateOpts) {
		return new TimeRangeFieldLabelState(opts, getTimeRangeFieldRoot());
	}
	readonly opts: TimeRangeFieldLabelStateOpts;
	readonly root: TimeRangeFieldRootState;
	readonly attachment: RefAttachment;

	constructor(opts: TimeRangeFieldLabelStateOpts, root: TimeRangeFieldRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => (this.root.labelNode = v));
	}

	#onclick = () => {
		if (this.root.opts.disabled.current) return;
		const firstSegment = getFirstSegment(this.root.fieldNode);
		if (!firstSegment) return;
		firstSegment.focus();
	};

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				'data-invalid': boolToEmptyStrOrUndef(this.root.isInvalid),
				'data-disabled': boolToEmptyStrOrUndef(this.root.opts.disabled.current),
				[timeRangeFieldAttrs.label]: '',
				onclick: this.#onclick,
				...this.attachment,
			}) as const,
	);
}

interface TimeRangeFieldInputStateOpts<T extends TimeValue = Time>
	extends
		WritableBoxedValues<{
			value: T | undefined;
		}>,
		ReadableBoxedValues<{
			name: string;
		}>,
		WithRefOpts {}

export class TimeRangeFieldInputState {
	static create(opts: Omit<TimeRangeFieldInputStateOpts, 'value'>, type: 'start' | 'end') {
		const root = getTimeRangeFieldRoot();
		const fieldState = TimeFieldRootState.create(
			{
				value: root.sideValueBox(type),
				disabled: root.opts.disabled,
				readonly: root.opts.readonly,
				readonlySegments: root.opts.readonlySegments,
				validate: boxWith(() => undefined),
				minValue: root.opts.minValue,
				maxValue: root.opts.maxValue,
				hourCycle: root.opts.hourCycle,
				locale: root.opts.locale,
				hideTimeZone: root.opts.hideTimeZone,
				required: root.opts.required,
				granularity: root.opts.granularity,
				placeholder: root.opts.placeholder,
				onInvalid: root.opts.onInvalid,
				errorMessageId: root.opts.errorMessageId,
				isInvalidProp: boxWith(() => root.isInvalid),
			},
			root,
		);

		return new TimeFieldInputState({ name: opts.name, id: opts.id, ref: opts.ref }, fieldState);
	}
}
