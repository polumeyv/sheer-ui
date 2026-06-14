import { declareVariants, type VariantProps } from 'overrule';

export const badgeVariants = declareVariants({
	base: 'focus-visible:border-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3',
	variants: {
		variant: {
			default: 'focus-visible:ring-ring/50 bg-primary text-primary-foreground [a&]:hover:bg-primary/90 border-transparent',
			secondary: 'focus-visible:ring-ring/50 bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 border-transparent',
			destructive:
				'bg-destructive [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/70 border-transparent text-white',
			outline: 'focus-visible:ring-ring/50 text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
			bronze: 'focus-visible:ring-ring/50 bg-amber-700 text-white [a&]:hover:bg-amber-700/90 border-transparent',
			gold: 'focus-visible:ring-ring/50 bg-amber-500 text-white [a&]:hover:bg-amber-500/90 border-transparent',
			platinum: 'focus-visible:ring-ring/50 bg-slate-400 text-white [a&]:hover:bg-slate-400/90 border-transparent',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
});

export type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];
