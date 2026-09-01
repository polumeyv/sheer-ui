import type { Snippet } from "svelte";
import type { EscapeLayerImplProps, EscapeLayerProps } from "../escape-layer/types.js";
import type {
	DismissibleLayerImplProps,
	DismissibleLayerProps,
} from "../dismissible-layer/types.js";
import type {
	FloatingLayerContentImplProps,
	FloatingLayerContentProps,
} from "../floating-layer/types.js";
import type { TextSelectionGuardProps } from "../types.js";
import type { ReadableBox } from "../tools/index.js";
import type { FocusScopeImplProps, FocusScopeProps } from "../focus-scope/types.js";
import type { ScrollLockProps } from "../body-scroll-lock.svelte.js";
import type { Direction } from "../index.js";

export type PopperLayerProps = EscapeLayerProps &
	Omit<DismissibleLayerProps, "onInteractOutsideStart"> &
	FloatingLayerContentProps &
	TextSelectionGuardProps &
	FocusScopeProps &
	Omit<ScrollLockProps, "restoreScrollDelay">;

export type PopperLayerStaticProps = EscapeLayerProps &
	Omit<DismissibleLayerProps, "onInteractOutsideStart"> &
	TextSelectionGuardProps &
	FocusScopeProps &
	Omit<ScrollLockProps, "restoreScrollDelay"> & {
		content?: Snippet<[{ props: Record<string, unknown> }]>;
		dir?: Direction;
	};

export type PopperLayerImplProps = Omit<
	EscapeLayerImplProps &
		DismissibleLayerImplProps &
		FloatingLayerContentImplProps &
		{ open: boolean; ref: ReadableBox<HTMLElement | null> } &
		TextSelectionGuardProps &
		FocusScopeImplProps & {
			popper: Snippet<[{ props: Record<string, unknown> }]>;
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
			 * Whether the always-mounted content is still rendered — open, or closed with its exit
			 * transition running. Gates the scroll lock. Defaults to the open state.
			 */
			present?: boolean;

			/**
			 * Override for the content's pointer-events style.
			 * @default "auto"
			 */
			contentPointerEvents?: "auto" | "none";
		},
	"enabled"
>;
