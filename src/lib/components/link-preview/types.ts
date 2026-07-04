import type { DismissibleLayerProps } from '../../internal/dismissible-layer/types.js';
import type { EscapeLayerProps } from '../../internal/escape-layer/types.js';
import type { FloatingLayerContentProps } from '../../internal/floating-layer/types.js';
import type { PortalProps } from '../../internal/portal/index.js';
import type { BitsPrimitiveAnchorAttributes, BitsPrimitiveDivAttributes } from '../../internal/attribute-types.js';
import type { OnChangeFn, WithChild, WithChildNoChildrenSnippetProps, WithChildren, Without } from '../../internal/types.js';
import type { FloatingContentSnippetProps } from '../../internal/types.js';

export type LinkPreviewRootPropsWithoutHTML = WithChildren<{
	/**
	 * The open state of the link preview.
	 *
	 * @defaultValue false
	 */
	open?: boolean;

	/**
	 * A callback that will be called when the link preview is opened or closed.
	 */
	onOpenChange?: OnChangeFn<boolean>;

	/**
	 * A callback that will be called when the link preview finishes opening/closing animations.
	 */
	onOpenChangeComplete?: OnChangeFn<boolean>;

	/**
	 * The delay in milliseconds before the preview opens.
	 *
	 * @defaultValue 700
	 */
	openDelay?: number;

	/**
	 * The delay in milliseconds before the preview closes.
	 *
	 * @defaultValue 300
	 */
	closeDelay?: number;

	/**
	 * When `true`, the preview will be disabled and will not open.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;

	/**
	 * Prevent the preview from opening if the focus did not come using
	 * the keyboard.
	 *
	 * @defaultValue false
	 */
	ignoreNonKeyboardFocus?: boolean;
}>;

export type LinkPreviewRootProps = LinkPreviewRootPropsWithoutHTML;

export type LinkPreviewContentPropsWithoutHTML = WithChildNoChildrenSnippetProps<
	Pick<
		FloatingLayerContentProps,
		| 'side'
		| 'sideOffset'
		| 'align'
		| 'alignOffset'
		| 'avoidCollisions'
		| 'collisionBoundary'
		| 'collisionPadding'
		| 'arrowPadding'
		| 'sticky'
		| 'hideWhenDetached'
		| 'dir'
		| 'customAnchor'
	> &
		Omit<DismissibleLayerProps, 'onInteractOutsideStart'> &
		EscapeLayerProps & {
			/**
			 * When `true`, the link preview content will be forced to mount in the DOM.
			 *
			 * Useful for more control over the transition behavior.
			 */
			forceMount?: boolean;
		},
	FloatingContentSnippetProps
>;

export type LinkPreviewContentProps = LinkPreviewContentPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, LinkPreviewContentPropsWithoutHTML>;

export type LinkPreviewPortalPropsWithoutHTML = PortalProps;
export type LinkPreviewPortalProps = LinkPreviewPortalPropsWithoutHTML;

export type LinkPreviewTriggerPropsWithoutHTML = WithChild;

export type LinkPreviewTriggerProps = LinkPreviewTriggerPropsWithoutHTML &
	Without<BitsPrimitiveAnchorAttributes, LinkPreviewTriggerPropsWithoutHTML>;
