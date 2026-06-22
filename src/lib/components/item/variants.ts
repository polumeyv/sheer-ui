import { declareVariants, type VariantProps } from 'overrule';

export const itemVariants = declareVariants({
	base: 'rounded-md border text-sm [a]:hover:bg-muted group/item focus-visible:border-ring focus-visible:ring-ring/50 flex w-full flex-wrap items-center transition-colors duration-100 outline-none focus-visible:ring-[3px] [a]:transition-colors',
	variants: {
		variant: {
			default: 'border-transparent',
			outline: 'border-border',
			muted: 'border-transparent bg-muted/50',
		},
		size: {
			default: 'gap-3.5 px-4 py-3.5',
			sm: 'gap-2.5 px-3 py-2.5',
			xs: 'gap-2 px-2.5 py-2 in-data-[slot=dropdown-menu-content]:p-0',
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
	},
});

export type ItemSize = VariantProps<typeof itemVariants>['size'];
export type ItemVariant = VariantProps<typeof itemVariants>['variant'];

export const itemMediaVariants = declareVariants({
	base: 'gap-2 group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start flex shrink-0 items-center justify-center [&_svg]:pointer-events-none',
	variants: {
		variant: {
			default: 'bg-transparent',
			icon: "[&_svg:not([class*='size-'])]:size-4",
			image: 'size-10 overflow-hidden rounded-sm group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
});

export type ItemMediaVariant = VariantProps<typeof itemMediaVariants>['variant'];
