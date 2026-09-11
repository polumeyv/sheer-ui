import type { NativePopoverPositionProps } from '../../internal/native-popover.svelte.js';
import type { OnChangeFn, WithChild, WithChildNoChildrenSnippetProps, Without } from '../../internal/types.js';
import type { Snippet } from 'svelte';
import type { OpenCell } from '../../internal/open-cell.svelte.js';
import type { BitsPrimitiveButtonAttributes, BitsPrimitiveDivAttributes } from '../../internal/attribute-types.js';
import type { FloatingContentSnippetProps } from '../../internal/types.js';
import type { PortalProps } from '../../internal/portal/index.js';

export type PopoverRootPropsWithoutHTML = {
	/**
	 * The derivation source for the popover's open state: the internal cell
	 * re-derives whenever this prop changes, and interactions (trigger, Escape,
	 * a snippet-cell write) override it until the next change. Reconcile
	 * dismissals via onOpenChangeComplete. Plain value — not bindable.
	 */
	open?: boolean;

	/**
	 * A callback that is called when the popover's open state changes and the animation is complete.
	 * This is an occurrence (animation settled), not a state mirror — depend on the cell instead.
	 */
	onOpenChangeComplete?: OnChangeFn<boolean>;

	/**
	 * A caller-constructed cell (own source and, optionally, a delegate writer)
	 * used instead of building one from `open`. When given, `open` is ignored.
	 */
	state?: OpenCell;

	/** Children receive the state cell, typed and guaranteed within the tree. */
	children?: Snippet<[OpenCell]>;
};

export type PopoverRootProps = PopoverRootPropsWithoutHTML;

export type PopoverContentPropsWithoutHTML = WithChildNoChildrenSnippetProps<
	NativePopoverPositionProps & { customAnchor?: HTMLElement | string | null },
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
