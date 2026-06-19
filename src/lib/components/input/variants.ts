import { declareVariants, type VariantProps } from 'overrule';

export const inputVariants = declareVariants({
	base: 'placeholder:text-muted-foreground w-full min-w-0 outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 h-9 px-2.5 py-1 text-sm ',
	variants: {
		variant: {
			default: 'cn-input',
			invisible: 'hide-input-identity',
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
