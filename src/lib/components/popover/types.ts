import type { EscapeLayerProps } from '../../components/utilities/escape-layer/types.js';
import type { DismissibleLayerProps } from '../../components/utilities/dismissible-layer/types.js';
import type { FloatingLayerContentProps } from '../../components/utilities/floating-layer/types.js';
import type { TextSelectionLayerProps } from '../../components/utilities/text-selection-layer/types.js';
import type { PresenceLayerProps } from '../../components/utilities/presence-layer/types.js';
import type { FocusScopeProps } from '../../components/utilities/focus-scope/types.js';
import type { ScrollLockProps } from '../../components/utilities/scroll-lock/index.js';
import type { OnChangeFn, WithChild, WithChildNoChildrenSnippetProps, WithChildren, Without } from '../../internal/types.js';
import type { BitsPrimitiveButtonAttributes, BitsPrimitiveDivAttributes } from '../../internal/attributes.js';
import type { FloatingContentSnippetProps } from '../../internal/types.js';
import type { PortalProps } from '../../components/utilities/portal/index.js';

/**
 * Content prop surface, composed from the same layer building blocks the (now-removed) Floating-UI
 * `PopperLayer` aggregated. The component no longer renders any Floating-UI layer — positioning is
 * native CSS `anchor()` — but the prop names are preserved so existing consumers keep type-checking;
 * the Floating-UI-only positioning props are simply ignored at runtime.
 */
type PopoverFloatingProps = EscapeLayerProps &
	Omit<DismissibleLayerProps, 'onInteractOutsideStart'> &
	FloatingLayerContentProps &
	PresenceLayerProps &
	TextSelectionLayerProps &
	FocusScopeProps &
	Omit<ScrollLockProps, 'restoreScrollDelay'>;

export type PopoverRootPropsWithoutHTML = WithChildren<{
	/**
	 * The open state of the popover.
	 */
	open?: boolean;

	/**
	 * A callback that is called when the popover's open state changes.
	 */
	onOpenChange?: OnChangeFn<boolean>;

	/**
	 * A callback that is called when the popover's open state changes and the animation is complete.
	 */
	onOpenChangeComplete?: OnChangeFn<boolean>;
}>;

export type PopoverRootProps = PopoverRootPropsWithoutHTML;

export type PopoverContentPropsWithoutHTML = WithChildNoChildrenSnippetProps<
	Omit<PopoverFloatingProps, 'content' | 'loop'>,
	FloatingContentSnippetProps
>;

export type PopoverContentProps = PopoverContentPropsWithoutHTML & Without<BitsPrimitiveDivAttributes, PopoverContentPropsWithoutHTML>;

export type PopoverTriggerPropsWithoutHTML = WithChild<{
	/**
	 * Whether the popover should open when the trigger is hovered.
	 * @default false
	 */
	openOnHover?: boolean;

	/**
	 * How long to wait before opening the popover on hover (ms).
	 * Only applies when `openOnHover` is `true`.
	 * @default 700
	 */
	openDelay?: number;

	/**
	 * How long to wait before closing the popover after hover ends (ms).
	 * Only applies when `openOnHover` is `true`.
	 * @default 300
	 */
	closeDelay?: number;
}>;

export type PopoverTriggerProps = PopoverTriggerPropsWithoutHTML & Without<BitsPrimitiveButtonAttributes, PopoverTriggerPropsWithoutHTML>;

export type PopoverClosePropsWithoutHTML = WithChild;

export type PopoverCloseProps = PopoverClosePropsWithoutHTML & Without<BitsPrimitiveButtonAttributes, PopoverClosePropsWithoutHTML>;

export type PopoverPortalPropsWithoutHTML = PortalProps;
export type PopoverPortalProps = PortalProps;
