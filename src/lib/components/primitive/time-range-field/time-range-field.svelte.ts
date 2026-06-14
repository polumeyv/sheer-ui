import { createContext, untrack } from 'svelte';
import type { Time } from '@internationalized/date';
import { attachRef, DOMContext, type ReadableProps, type WritableProps } from '$lib/vendor/index';
import { TimeFieldRootState } from '$lib/components/primitive/time-field/time-field.svelte';
import { TimeFieldInputState } from '$lib/components/primitive/time-field/time-field.svelte';
import { useId } from '$lib/vendor/use-id';
import type { TimeSegmentPart } from '$lib/shared/index';
import type { RefAttachment, WithRefProps } from '$lib/vendor/types';
import { createBitsAttrs } from '$lib/vendor/attrs';
import type { TimeGranularity, TimeOnInvalid, TimeRange, TimeRangeValidator, TimeValue } from '$lib/shared/date/types';
import { type TimeFormatter, createTimeFormatter } from '$lib/vendor/date-time/formatter';
import { removeDescriptionElement } from '$lib/vendor/date-time/field/helpers';
import { getFirstSegment } from '$lib/vendor/date-time/field/segments';
import { convertTimeValueToTime, isTimeBefore } from '$lib/vendor/date-time/field/time-helpers';

export const timeRangeFieldAttrs = createBitsAttrs({
	component: 'time-range-field',
	parts: ['root', 'label'],
});

export const [getTimeRangeFieldRootContext, setTimeRangeFieldRootContext] = createContext<TimeRangeFieldRootState>();

interface TimeRangeFieldRootStateOpts<T extends TimeValue = Time>
	extends
		WithRefProps,
		WritableProps<{
			value: TimeRange<T>;
			placeholder: TimeValue;
			startValue: T | undefined;
			endValue: T | undefined;
		}>,
		ReadableProps<{
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
		return setTimeRangeFieldRootContext(new TimeRangeFieldRootState(opts) as unknown as TimeRangeFieldRootState);
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
	readonly startValueComplete = $derived.by(() => this.opts.startValue.current !== undefined);
	readonly endValueComplete = $derived.by(() => this.opts.endValue.current !== undefined);
	readonly rangeComplete = $derived(this.startValueComplete && this.endValueComplete);

	readonly startValueTime = $derived.by(() => {
		if (!this.opts.startValue.current) return undefined;
		return convertTimeValueToTime(this.opts.startValue.current);
	});

	readonly endValueTime = $derived.by(() => {
		if (!this.opts.endValue.current) return undefined;
		return convertTimeValueToTime(this.opts.endValue.current);
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
		$effect(() => () => {
			removeDescriptionElement(this.descriptionId, this.domContext.getDocument());
		});

		$effect(() => {
			if (this.formatter.getLocale() === this.opts.locale.current) return;
			this.formatter.setLocale(this.opts.locale.current);
		});

		/**
		 * Synchronize the start and end values with the `value` in case
		 * it is updated externally.
		 */
		$effect(() => {
			const value = this.opts.value.current;
			untrack(() => {
				if (value.start && value.end) {
					this.opts.startValue.current = value.start;
					this.opts.endValue.current = value.end;
				} else if (value.start) {
					this.opts.startValue.current = value.start;
					this.opts.endValue.current = undefined;
				} else if (value.start === undefined && value.end === undefined) {
					this.opts.startValue.current = undefined;
					this.opts.endValue.current = undefined;
				}
			});
		});

		/**
		 * Synchronize the placeholder value with the current start value
		 */
		$effect(() => {
			const value = this.opts.value.current;
			untrack(() => {
				const startValue = value.start;
				if (startValue && this.opts.placeholder.current !== startValue) {
					this.opts.placeholder.current = startValue;
				}
			});
		});

		$effect(() => {
			const startValue = this.opts.startValue.current;
			const endValue = this.opts.endValue.current;
			untrack(() => {
				if (this.opts.value.current && this.opts.value.current.start === startValue && this.opts.value.current.end === endValue) {
					return;
				}

				if (startValue && endValue) {
					this.#updateValue((prev) => {
						if (prev.start === startValue && prev.end === endValue) {
							return prev;
						}
						return {
							start: startValue,
							end: endValue,
						};
					});
				} else if (this.opts.value.current && this.opts.value.current.start && this.opts.value.current.end) {
					this.opts.value.current.start = undefined;
					this.opts.value.current.end = undefined;
				}
			});
		});
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
				'data-invalid': this.isInvalid ? '' : undefined,
				...this.attachment,
			}) as const,
	);
}

interface TimeRangeFieldLabelStateOpts extends WithRefProps {}

export class TimeRangeFieldLabelState {
	static create(opts: TimeRangeFieldLabelStateOpts) {
		return new TimeRangeFieldLabelState(opts, getTimeRangeFieldRootContext());
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
				'data-invalid': this.root.isInvalid ? '' : undefined,
				'data-disabled': this.root.opts.disabled.current ? '' : undefined,
				[timeRangeFieldAttrs.label]: '',
				onclick: this.#onclick,
				...this.attachment,
			}) as const,
	);
}

interface TimeRangeFieldInputStateOpts<T extends TimeValue = Time>
	extends
		WritableProps<{
			value: T | undefined;
		}>,
		ReadableProps<{
			name: string;
		}>,
		WithRefProps {}

export class TimeRangeFieldInputState {
	static create(opts: Omit<TimeRangeFieldInputStateOpts, 'value'>, type: 'start' | 'end') {
		const root = getTimeRangeFieldRootContext();
		const fieldState = TimeFieldRootState.create(
			{
				value: type === 'start' ? root.opts.startValue : root.opts.endValue,
				disabled: root.opts.disabled,
				readonly: root.opts.readonly,
				readonlySegments: root.opts.readonlySegments,
				validate: { get current() { return undefined; } },
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
				isInvalidProp: { get current() { return root.isInvalid; } },
			},
			root,
		);

		return new TimeFieldInputState({ name: opts.name, id: opts.id, ref: opts.ref }, fieldState);
	}
}
