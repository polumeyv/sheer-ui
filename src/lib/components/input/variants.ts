import { declareVariants, type VariantProps } from 'overrule';

export const inputVariants = declareVariants({
	base: 'placeholder:text-muted-foreground w-full min-w-0 outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 h-9 px-2.5 py-1 ',
	variants: {
		variant: {
			default:
				'rounded-md border border-input bg-transparent text-base shadow-xs transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
			invisible:
				'rounded-none border-0 bg-transparent text-sm shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
});

export type InputVariant = VariantProps<typeof inputVariants>['variant'];

/**
 * Per-variant `data-slot`. An invisible input is an input-group control, which the
 * `.wrap-input-identity` wrapper targets via `has-[[data-slot=input-group-control]...]`.
 * A caller can still pass an explicit `data-slot` to override this.
 */
export const inputVariantSlots = {
	default: 'input',
	invisible: 'input-group-control',
} as const satisfies Record<NonNullable<InputVariant>, string>;
