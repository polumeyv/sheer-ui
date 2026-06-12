import { tv, type VariantProps } from '../../utils';

export const sheetVariants = tv({
	base: 'bg-background fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
	variants: {
		side: {
			top: 'starting:-translate-y-full data-[state=closed]:-translate-y-full inset-x-0 top-0 h-auto border-b',
			bottom: 'starting:translate-y-full data-[state=closed]:translate-y-full inset-x-0 bottom-0 h-auto border-t',
			left: 'starting:-translate-x-full data-[state=closed]:-translate-x-full rtl:starting:translate-x-full rtl:data-[state=closed]:translate-x-full inset-y-0 inset-s-0 h-full w-3/4 border-e sm:max-w-sm',
			right:
				'starting:translate-x-full data-[state=closed]:translate-x-full rtl:starting:-translate-x-full rtl:data-[state=closed]:-translate-x-full inset-y-0 inset-e-0 h-full w-3/4 border-s sm:max-w-sm',
		},
	},
	defaultVariants: {
		side: 'right',
	},
});

export type Side = VariantProps<typeof sheetVariants>['side'];
