import { declareVariants, type VariantProps } from 'overrule';

export const fieldVariants = declareVariants({
	base: 'data-[invalid=true]:text-destructive gap-3 group/field flex w-full',
	variants: {
		orientation: {
			vertical: 'np-field-orientation-vertical flex-col [&>*]:w-full [&>.sr-only]:w-auto',
			horizontal:
				'np-field-orientation-horizontal flex-row items-center has-[>[data-slot=field-content]]:items-start [&>[data-slot=field-label]]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
			responsive:
				'np-field-orientation-responsive flex-col @md/field-group:flex-row @md/field-group:items-center @md/field-group:has-[>[data-slot=field-content]]:items-start [&>*]:w-full @md/field-group:[&>*]:w-auto [&>.sr-only]:w-auto @md/field-group:[&>[data-slot=field-label]]:flex-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
		},
	},
	defaultVariants: {
		orientation: 'vertical',
	},
});

export type FieldOrientation = VariantProps<typeof fieldVariants>['orientation'];
