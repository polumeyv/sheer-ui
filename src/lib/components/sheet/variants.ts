import { declareVariants, type VariantProps } from 'overrule';

// The slide itself lives in sheet-content's <style> as `data-state`-keyed keyframes
// (with `data-side` selecting the edge); the variant owns box + placement only.
export const sheetVariants = declareVariants({
	base: 'bg-background fixed z-50 flex flex-col gap-4 shadow-lg',
	variants: {
		side: {
			top: 'inset-x-0 top-0 h-auto border-b',
			bottom: 'inset-x-0 bottom-0 h-auto border-t',
			left: 'inset-y-0 inset-s-0 h-full w-3/4 border-e sm:max-w-sm',
			right: 'inset-y-0 inset-e-0 h-full w-3/4 border-s sm:max-w-sm',
		},
	},
	defaultVariants: {
		side: 'right',
	},
});

export type Side = VariantProps<typeof sheetVariants>['side'];
