import { declareVariants, type VariantProps } from 'overrule';

export const itemVariants = declareVariants({
	base: 'cn-item group/item focus-visible:border-ring focus-visible:ring-ring/50 flex w-full flex-wrap items-center transition-colors duration-100 outline-none focus-visible:ring-[3px] [a]:transition-colors',
	variants: {
		variant: {
			default: 'cn-item-variant-default',
			outline: 'cn-item-variant-outline',
			muted: 'cn-item-variant-muted',
		},
		size: {
			default: 'cn-item-size-default',
			sm: 'cn-item-size-sm',
			xs: 'cn-item-size-xs',
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
	base: 'cn-item-media flex shrink-0 items-center justify-center [&_svg]:pointer-events-none',
	variants: {
		variant: {
			default: 'cn-item-media-variant-default',
			icon: 'cn-item-media-variant-icon',
			image: 'cn-item-media-variant-image',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
});

export type ItemMediaVariant = VariantProps<typeof itemMediaVariants>['variant'];
