import { declareVariants, type VariantProps } from 'overrule';

/**
 * The interactive-button base shared verbatim by the button and the toggle. These
 * are the layout/reset/focus-invalid tokens both render identically (flex centering,
 * disabled handling, svg sizing, aria-invalid scaffolding). Lifting them here keeps
 * the two bases from drifting; each component still owns the tokens that genuinely
 * differ (button: border + press feel + transition-all; toggle: gap/rounded/text +
 * pressed-state styling). Available for any other button-shaped part (toolbar,
 * sidebar) that wants the same reset.
 */
export const interactiveBase =
	'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive font-medium inline-flex items-center justify-center whitespace-nowrap outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0';

export const buttonVariants = declareVariants({
	base: `${interactiveBase} dark:aria-invalid:border-destructive/50 border bg-clip-padding focus-visible:ring-3 active:translate-y-px aria-invalid:ring-3 group/button shrink-0 transition-all select-none`,
	variants: {
		variant: {
			default:
				'focus-visible:border-ring focus-visible:ring-ring/50 border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
			card: 'focus-visible:border-ring focus-visible:ring-ring/50 border-transparent bg-card-foreground text-card hover:bg-card-foreground/80 shadow-xs',
			outline:
				'focus-visible:border-ring focus-visible:ring-ring/50 border-border bg-background hover:bg-muted hover:text-foreground dark:bg-border/30 dark:border-border dark:hover:bg-border/50 aria-expanded:bg-muted aria-expanded:text-foreground shadow-xs',
			secondary:
				'focus-visible:border-ring focus-visible:ring-ring/50 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
			ghost:
				'focus-visible:border-ring focus-visible:ring-ring/50 border-transparent hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground',
			destructive:
				'border-transparent bg-destructive/10 hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/20 text-destructive focus-visible:border-destructive/40 dark:hover:bg-destructive/30',
			link: 'focus-visible:border-ring focus-visible:ring-ring/50 border-transparent text-primary underline-offset-4 hover:underline',
		},
		size: {
			default:
				"rounded-md text-sm [&_svg:not([class*='size-'])]:size-4 h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
			xs: "h-6 gap-1 rounded-[min(var(--radius-md),8px)] px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
			sm: "text-sm [&_svg:not([class*='size-'])]:size-4 h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2.5 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
			lg: "rounded-md text-sm [&_svg:not([class*='size-'])]:size-4 h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
			icon: "rounded-md text-sm [&_svg:not([class*='size-'])]:size-4 size-9",
			'icon-xs': "text-sm size-6 rounded-[min(var(--radius-md),8px)] [&_svg:not([class*='size-'])]:size-3",
			'icon-sm': "text-sm [&_svg:not([class*='size-'])]:size-4 size-8 rounded-[min(var(--radius-md),10px)]",
			'icon-lg': "rounded-md text-sm [&_svg:not([class*='size-'])]:size-4 size-10",
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
	},
});

export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
export type ButtonSize = VariantProps<typeof buttonVariants>['size'];
