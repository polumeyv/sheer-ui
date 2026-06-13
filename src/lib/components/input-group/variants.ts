import { tv, type VariantProps } from '../../vendor/utils';

export const inputGroupAddonVariants = tv({
	base: "text-muted-foreground flex h-auto cursor-text items-center gap-2 py-1.5 text-sm font-medium select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
	variants: {
		align: {
			'inline-start': 'justify-center order-first ps-3 has-[>button]:ms-[-0.45rem] has-[>kbd]:ms-[-0.35rem]',
			'inline-end': 'justify-center order-last pe-3 has-[>button]:me-[-0.45rem] has-[>kbd]:me-[-0.35rem]',
			'block-start': 'order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-2.5 [.border-b]:pb-3',
			'block-end': 'order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-2.5 [.border-t]:pt-3',
		},
	},
	defaultVariants: {
		align: 'inline-start',
	},
});

export type InputGroupAddonAlign = VariantProps<typeof inputGroupAddonVariants>['align'];

export const inputGroupButtonVariants = tv({
	base: 'text-sm shadow-none',
	variants: {
		size: {
			xs: "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-2 has-[>svg]:px-2 [&>svg:not([class*='size-'])]:size-3.5",
			sm: "h-8 gap-1.5 rounded-md px-2.5 has-[>svg]:px-2.5 [&_svg:not([class*='size-'])]:size-4",
			'icon-xs': "gap-2 size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0 [&_svg:not([class*='size-'])]:size-4",
			'icon-sm': "gap-2 size-8 rounded-md p-0 has-[>svg]:p-0 [&_svg:not([class*='size-'])]:size-4",
		},
	},
	defaultVariants: {
		size: 'xs',
	},
});

export type InputGroupButtonSize = VariantProps<typeof inputGroupButtonVariants>['size'];
