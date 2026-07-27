import type { Snippet } from 'svelte';
import type { OpenCell } from '../../internal/open-cell.svelte.js';
import type { DismissibleLayerProps } from '../../internal/dismissible-layer/types.js';
import type { EscapeLayerProps } from '../../internal/escape-layer/types.js';
import type { FloatingLayerContentProps } from '../../internal/floating-layer/types.js';
import type { PortalProps } from '../../internal/portal/index.js';
import type { BitsPrimitiveAnchorAttributes, BitsPrimitiveDivAttributes } from '../../internal/attribute-types.js';
import type { OnChangeFn, WithChild, WithChildNoChildrenSnippetProps, WithChildren, Without } from '../../internal/types.js';
import type { FloatingContentSnippetProps } from '../../internal/types.js';

export type LinkPreviewRootPropsWithoutHTML = Omit<
	WithChildren<{
	/**
	 * The derivation source for the link preview's open state: the internal cell
	 * re-derives whenever this prop changes, and interactions override it until
	 * the next change. Plain value — not bindable.
	 */
	open?: boolean;

	/**
	 * A caller-constructed cell (own source and, optionally, a delegate writer)
	 * used instead of building one from `open`. When given, `open` is ignored.
	 */
	state?: OpenCell;

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
}>,
	'children'
> & {
	/** Children receive the state cell, typed and guaranteed within the tree. */
	children?: Snippet<[OpenCell]>;
};

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
