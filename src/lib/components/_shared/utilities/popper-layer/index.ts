import type { Snippet } from "svelte";
import type { EscapeLayerImplProps, EscapeLayerProps } from "$lib/components/_shared/utilities/escape-layer/index.js";
import type {
	DismissibleLayerImplProps,
	DismissibleLayerProps,
} from "$lib/components/_shared/utilities/dismissible-layer/index.js";
import type {
	FloatingLayerContentImplProps,
	FloatingLayerContentProps,
} from "$lib/components/_shared/utilities/floating-layer/index.js";
import type {
	TextSelectionLayerImplProps,
	TextSelectionLayerProps,
} from "$lib/components/_shared/utilities/text-selection-layer/index.js";
import type { PresenceLayerImplProps, PresenceLayerProps } from "$lib/components/_shared/utilities/presence-layer/index.js";
import type { FocusScopeImplProps, FocusScopeProps } from "$lib/components/_shared/utilities/focus-scope/index.js";
import type { ScrollLockProps } from "$lib/components/_shared/utilities/scroll-lock/index.js";
import type { Direction } from "$lib/shared/index.js";

export type PopperLayerProps = EscapeLayerProps &
	Omit<DismissibleLayerProps, "onInteractOutsideStart"> &
	FloatingLayerContentProps &
	PresenceLayerProps &
	TextSelectionLayerProps &
	FocusScopeProps &
	Omit<ScrollLockProps, "restoreScrollDelay">;

export type PopperLayerStaticProps = EscapeLayerProps &
	Omit<DismissibleLayerProps, "onInteractOutsideStart"> &
	PresenceLayerProps &
	TextSelectionLayerProps &
	FocusScopeProps &
	Omit<ScrollLockProps, "restoreScrollDelay"> & {
		content?: Snippet<[{ props: Record<string, unknown> }]>;
		dir?: Direction;
	};

export type PopperLayerImplProps = Omit<
	EscapeLayerImplProps &
		DismissibleLayerImplProps &
		FloatingLayerContentImplProps &
		Omit<PresenceLayerImplProps, "presence"> &
		TextSelectionLayerImplProps &
		FocusScopeImplProps & {
			popper: Snippet<
				[{ props: Record<string, unknown>; wrapperProps: Record<string, unknown> }]
			>;
			isStatic?: boolean;
			/**
			 * Tooltips are special in that they are commonly composed
			 * with other floating components, where the same trigger is
			 * used for both the tooltip and the popover.
			 *
			 * For situations like this, we need to use a different context
			 * symbol so that conflicts don't occur.
			 */
			tooltip?: boolean;

			/**
			 * Whether the popper layer should be rendered.
			 */
			shouldRender: boolean;

			/**
			 * Override for the content's pointer-events style.
			 * @default "auto"
			 */
			contentPointerEvents?: "auto" | "none";
		},
	"enabled"
>;

export { default as PopperLayer } from "$lib/components/_shared/utilities/popper-layer/popper-layer.svelte";
