import { declareVariants, type VariantProps } from 'overrule';
import { interactiveBase } from '../button/variants';

export const toggleVariants = declareVariants({
	base: `${interactiveBase} data-[state=on]:bg-accent data-[state=on]:text-accent-foreground focus-visible:border-ring focus-visible:ring-ring/50 gap-2 rounded-md text-sm transition-[color,box-shadow] focus-visible:ring-[3px] [&_svg:not([class*='size-'])]:size-4`,
	variants: {
		variant: {
			default: 'bg-transparent hover:bg-muted hover:text-muted-foreground',
			outline: 'border-border hover:bg-accent hover:text-accent-foreground border bg-transparent shadow-xs',
		},
		size: {
			default: 'h-9 min-w-9 px-2',
			sm: 'h-8 min-w-8 px-1.5',
			lg: 'h-10 min-w-10 px-2.5',
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
	},
});

export type ToggleVariant = VariantProps<typeof toggleVariants>['variant'];
export type ToggleSize = VariantProps<typeof toggleVariants>['size'];
export type ToggleVariants = VariantProps<typeof toggleVariants>;
