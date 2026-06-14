import { declareVariants, type VariantProps } from '../../vendor/utils';

export const itemVariants = declareVariants({
	base: 'group/item [a]:hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 flex flex-wrap items-center rounded-md border text-sm transition-colors duration-100 outline-none focus-visible:ring-[3px] [a]:transition-colors',
	variants: {
		variant: {
			default: 'bg-transparent border-transparent',
			outline: 'border-border',
			muted: 'bg-muted/50 border-transparent',
		},
		size: {
			default: 'gap-4 p-4',
			sm: 'gap-2.5 px-4 py-3',
			lg: 'gap-4 p-5',
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
	base: 'flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none',
	variants: {
		variant: {
			default: 'bg-transparent',
			icon: "bg-muted size-8 rounded-md border [&_svg:not([class*='size-'])]:size-4",
			image: 'size-10 overflow-hidden rounded-md [&_img]:size-full [&_img]:object-cover',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
});

export type ItemMediaVariant = VariantProps<typeof itemMediaVariants>['variant'];
