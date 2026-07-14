import type { DateValue } from '@internationalized/date';
import { boxWith, attachRef, DOMContext, type ReadableBoxedValues, type WritableBoxedValues } from '../../internal/tools/index.js';
import { createContext, onMount } from 'svelte';
import { DateFieldInputState, DateFieldRootState } from '../date-field/date-field.svelte.js';
import { useId } from '../../internal/use-id.js';
import type { DateOnInvalid, DateRange, DateRangeValidator, SegmentPart } from '../../internal/index.js';
import type { RefAttachment, WithRefOpts } from '../../internal/types.js';
import { createBitsAttrs, boolToEmptyStrOrUndef } from '../../internal/attrs.js';
import type { Granularity } from '../../internal/date-time/types.js';
import { type Formatter, createFormatter } from '../../internal/date-time/formatter.js';
import { isBefore } from '../../internal/date-time/utils.js';
import { getFirstSegment } from '../../internal/date-time/field/segments.js';
import { RangeFieldValueController } from '../../internal/date-time/field/range-field.svelte.js';

export const dateRangeFieldAttrs = createBitsAttrs({
	component: 'date-range-field',
	parts: ['root', 'label'],
});

export const [getDateRangeFieldRoot, setDateRangeFieldRoot] = createContext<DateRangeFieldRootState>();

interface DateRangeFieldRootStateOpts
	extends
		WithRefOpts,
		WritableBoxedValues<{
			value: DateRange;
			placeholder: DateValue;
		}>,
		ReadableBoxedValues<{
			readonlySegments: SegmentPart[];
			validate: DateRangeValidator | undefined;
			onInvalid: DateOnInvalid | undefined;
			minValue: DateValue | undefined;
			maxValue: DateValue | undefined;
			disabled: boolean;
			readonly: boolean;
			granularity: Granularity | undefined;
			hourCycle: 12 | 24 | undefined;
			locale: string;
			hideTimeZone: boolean;
			required: boolean;
			errorMessageId: string | undefined;
		}> {}

export class DateRangeFieldRootState {
	static create(opts: DateRangeFieldRootStateOpts) {
		return setDateRangeFieldRoot(new DateRangeFieldRootState(opts));
	}

	readonly opts: DateRangeFieldRootStateOpts;
	startFieldState: DateFieldRootState | undefined = undefined;
	endFieldState: DateFieldRootState | undefined = undefined;
	descriptionId = useId();
	formatter: Formatter;
	fieldNode = $state<HTMLElement | null>(null);
	labelNode = $state<HTMLElement | null>(null);
	descriptionNode = $state<HTMLElement | null>(null);
	readonly valueController: RangeFieldValueController<DateValue>;
	get startValue() { return this.valueController.start; }
	get endValue() { return this.valueController.end; }
	get startValueComplete() { return this.valueController.startComplete; }
	get endValueComplete() { return this.valueController.endComplete; }
	get rangeComplete() { return this.valueController.complete; }
	domContext: DOMContext;
	readonly attachment: RefAttachment;

	constructor(opts: DateRangeFieldRootStateOpts) {
		this.opts = opts;
		this.valueController = new RangeFieldValueController(opts.value, opts.placeholder);
		this.formatter = createFormatter({
			locale: this.opts.locale,
			monthFormat: boxWith(() => 'long'),
			yearFormat: boxWith(() => 'numeric'),
		});
		this.domContext = new DOMContext(this.opts.ref);
		this.attachment = attachRef(this.opts.ref, (v) => (this.fieldNode = v));

		onMount(() => () => {
			this.domContext.getDocument().getElementById(this.descriptionId)?.remove();
		});
	}

	/** Box for a child field's value: reads the derived side; writes override it and recommit the range. */
	sideValueBox(type: 'start' | 'end') {
		return this.valueController.sideValueBox(type);
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

		const minValue = this.opts.minValue.current;
		if (minValue && value.start && isBefore(value.start, minValue)) {
			return {
				reason: 'min',
			} as const;
		}

		const maxValue = this.opts.maxValue.current;

		if ((maxValue && value.end && isBefore(maxValue, value.end)) || (maxValue && value.start && isBefore(maxValue, value.start))) {
			return {
				reason: 'max',
			} as const;
		}

		return false as const;
	});

	readonly isInvalid = $derived(this.validationStatus !== false);

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: 'group',
				[dateRangeFieldAttrs.root]: '',
				'data-invalid': boolToEmptyStrOrUndef(this.isInvalid),
				...this.attachment,
			}) as const,
	);
}

interface DateRangeFieldLabelStateOpts extends WithRefOpts {}

export class DateRangeFieldLabelState {
	static create(opts: DateRangeFieldLabelStateOpts) {
		return new DateRangeFieldLabelState(opts, getDateRangeFieldRoot());
	}

	readonly opts: DateRangeFieldLabelStateOpts;
	readonly root: DateRangeFieldRootState;
	readonly attachment: RefAttachment;

	constructor(opts: DateRangeFieldLabelStateOpts, root: DateRangeFieldRootState) {
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
				[dateRangeFieldAttrs.label]: '',
				onclick: this.#onclick,
				...this.attachment,
			}) as const,
	);
}

interface DateRangeFieldInputStateOpts
	extends
		WithRefOpts,
		WritableBoxedValues<{
			value: DateValue | undefined;
		}>,
		ReadableBoxedValues<{
			name: string;
		}> {}

export class DateRangeFieldInputState {
	static create(opts: Omit<DateRangeFieldInputStateOpts, 'value'>, type: 'start' | 'end') {
		const root = getDateRangeFieldRoot();
		const fieldState = DateFieldRootState.create(
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
		return new DateFieldInputState({ name: opts.name, id: opts.id, ref: opts.ref }, fieldState);
	}
}
