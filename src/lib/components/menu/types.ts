import type { Expand } from '../../internal/tools/index.js';
import type { PopperLayerProps, PopperLayerStaticProps } from '../../internal/popper-layer/types.js';
import type { FloatingLayerArrowProps, FloatingLayerArrowPropsWithoutHTML } from '../../internal/floating-layer/types.js';
import type { OnChangeFn, WithChild, WithChildNoChildrenSnippetProps, WithChildren, Without } from '../../internal/types.js';
import type { BitsPrimitiveButtonAttributes, BitsPrimitiveDivAttributes } from '../../internal/attribute-types.js';
import type { Direction } from '../../internal/index.js';
import type { Snippet } from 'svelte';
import type { OpenCell } from '../../internal/open-cell.svelte.js';
import type { PortalProps } from '../../internal/portal/index.js';
import type { FloatingContentSnippetProps, StaticContentSnippetProps } from '../../internal/types.js';

export type MenuRootPropsWithoutHTML = {
	/**
	 * The derivation source for the menu's open state: the internal cell
	 * re-derives whenever this prop changes, and interactions (trigger, Escape,
	 * a snippet-cell write) override it until the next change. Reconcile
	 * dismissals via onOpenChangeComplete. Plain value — not bindable.
	 */
	open?: boolean;

	// /**
	//  * When `true`, renders safe-area debug overlays for submenu pointer intent.
	//  *
	//  * @defaultValue false
	//  */
	// debugMode?: boolean;

	/**
	 * A callback that is called when the menu finishes opening/closing animations.
	 * This is an occurrence (animation settled), not a state mirror — depend on the cell instead.
	 */
	onOpenChangeComplete?: OnChangeFn<boolean>;

	/**
	 * A caller-constructed cell (own source and, optionally, a delegate writer)
	 * used instead of building one from `open`. When given, `open` is ignored.
	 */
	state?: OpenCell;

	/**
	 * The direction of the site.
	 *
	 * @defaultValue "ltr"
	 */
	dir?: Direction;

	/** Children receive the state cell, typed and guaranteed within the tree. */
	children?: Snippet<[OpenCell]>;
};

export type MenuRootProps = MenuRootPropsWithoutHTML;

export type _SharedMenuContentProps = {
	/**
	 * When `true`, the menu will loop through items when navigating with the keyboard.
	 *
	 * @defaultValue false
	 */
	loop?: boolean;
};

export type MenuContentPropsWithoutHTML = Expand<
	WithChildNoChildrenSnippetProps<Omit<PopperLayerProps, 'content'> & _SharedMenuContentProps, FloatingContentSnippetProps>
>;

export type MenuContentProps = MenuContentPropsWithoutHTML & Without<BitsPrimitiveDivAttributes, MenuContentPropsWithoutHTML>;

export type MenuContentStaticPropsWithoutHTML = Expand<
	WithChildNoChildrenSnippetProps<Omit<PopperLayerStaticProps, 'content'> & _SharedMenuContentProps, StaticContentSnippetProps>
>;

export type MenuContentStaticProps = MenuContentStaticPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, MenuContentStaticPropsWithoutHTML>;

export type MenuItemPropsWithoutHTML<U extends Record<PropertyKey, unknown> = { _default: never }> = WithChild<
	{
		/**
		 * When `true`, the user will not be able to interact with the menu item.
		 *
		 * @defaultValue false
		 */
		disabled?: boolean;

		/**
		 * A callback fired when the menu item is selected.
		 *
		 * Calling `event.preventDefault()` keeps a plain or radio item from closing the
		 * menu; the radio item still selects. A checkbox item never closes it.
		 */
		onSelect?: (event: Event) => void;
	},
	U
>;

export type MenuItemProps = MenuItemPropsWithoutHTML & Without<BitsPrimitiveDivAttributes, MenuItemPropsWithoutHTML>;

export type MenuCheckboxItemSnippetProps = { checked: boolean; indeterminate: boolean };

export type MenuCheckboxItemPropsWithoutHTML = MenuItemPropsWithoutHTML<MenuCheckboxItemSnippetProps> & {
	/**
	 * The checked state of the checkbox. It can be one of:
	 * - `true` for checked
	 * - `false` for unchecked
	 *
	 * @defaultValue false
	 */
	checked?: boolean;

	/**
	 * A callback that is fired when the checked state changes.
	 */
	onCheckedChange?: OnChangeFn<boolean>;

	/**
	 * Whether the checkbox is in an indeterminate state or not.
	 *
	 * @defaultValue false
	 */
	indeterminate?: boolean;

	/**
	 * A callback function called when the indeterminate state changes.
	 */
	onIndeterminateChange?: OnChangeFn<boolean>;

	/**
	 * The value of the checkbox item when used in a checkbox group.
	 */
	value?: string;
};

export type MenuCheckboxItemProps = MenuCheckboxItemPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, MenuCheckboxItemPropsWithoutHTML>;

export type MenuCheckboxGroupPropsWithoutHTML = WithChild<{
	/**
	 * The values of the selected checkbox items.
	 *
	 * Supports two-way binding with `bind:value`.
	 */
	value?: string[];

	/**
	 * A callback that is fired when the selected checkbox items change.
	 */
	onValueChange?: OnChangeFn<string[]>;
}>;

export type MenuCheckboxGroupProps = MenuCheckboxGroupPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, MenuCheckboxGroupPropsWithoutHTML>;

export type MenuTriggerPropsWithoutHTML = WithChild<{
	/**
	 * Whether the trigger is disabled.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean | null | undefined;
}>;

export type MenuTriggerProps = MenuTriggerPropsWithoutHTML & Without<BitsPrimitiveButtonAttributes, MenuTriggerPropsWithoutHTML>;

export type MenuSubPropsWithoutHTML = WithChildren<{
	/**
	 * The open state of the menu.
	 */
	open?: boolean;

	/**
	 * A callback that is called when the menu is opened or closed.
	 */
	onOpenChange?: OnChangeFn<boolean>;

	/**
	 * A callback that is called when the menu finishes opening/closing animations.
	 */
	onOpenChangeComplete?: OnChangeFn<boolean>;
}>;

export type MenuSubProps = MenuSubPropsWithoutHTML;

export type MenuSubContentPropsWithoutHTML = Expand<
	WithChildNoChildrenSnippetProps<
		Omit<PopperLayerProps, 'content' | 'preventScroll'> & _SharedMenuContentProps,
		FloatingContentSnippetProps
	>
>;

export type MenuSubContentProps = MenuSubContentPropsWithoutHTML & Without<BitsPrimitiveDivAttributes, MenuSubContentPropsWithoutHTML>;

export type MenuSubContentStaticPropsWithoutHTML = Expand<
	WithChildNoChildrenSnippetProps<
		Omit<PopperLayerStaticProps, 'content' | 'preventScroll'> & _SharedMenuContentProps,
		StaticContentSnippetProps
	>
>;

export type MenuSubContentStaticProps = MenuSubContentStaticPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, MenuSubContentStaticPropsWithoutHTML>;

export type MenuSubTriggerPropsWithoutHTML = Omit<MenuItemPropsWithoutHTML, 'onSelect'> & {
	/**
	 * A callback fired when the sub-trigger is selected, right before its submenu opens.
	 * `event.preventDefault()` has no effect here: the submenu opens either way and the
	 * parent menu never closes on a sub-trigger.
	 */
	onSelect?: (event: Event) => void;

	/**
	 * The amount of time in ms from when the mouse enters the subtrigger until
	 * the submenu opens. This is useful for preventing the submenu from opening
	 * as a user is moving their mouse through the menu without a true intention to open that
	 * submenu.
	 *
	 * To disable the behavior, set it to `0`.
	 *
	 * @default 100
	 */
	openDelay?: number;
};

export type MenuSubTriggerProps = MenuSubTriggerPropsWithoutHTML & Without<BitsPrimitiveDivAttributes, MenuSubTriggerPropsWithoutHTML>;

export type MenuSeparatorPropsWithoutHTML = WithChild;
export type MenuSeparatorProps = MenuSeparatorPropsWithoutHTML & Without<BitsPrimitiveDivAttributes, MenuSeparatorPropsWithoutHTML>;

export type MenuArrowPropsWithoutHTML = FloatingLayerArrowPropsWithoutHTML;
export type MenuArrowProps = FloatingLayerArrowProps;

export type MenuGroupPropsWithoutHTML = WithChild;
export type MenuGroupProps = MenuGroupPropsWithoutHTML & Without<BitsPrimitiveDivAttributes, MenuGroupPropsWithoutHTML>;

export type MenuGroupHeadingPropsWithoutHTML = WithChild;
export type MenuGroupHeadingProps = MenuGroupHeadingPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, MenuGroupHeadingPropsWithoutHTML>;

export type MenuRadioGroupPropsWithoutHTML = WithChild<{
	/**
	 * The value of the selected radio item.
	 *
	 * Supports two-way binding with `bind:value`.
	 */
	value?: string;

	/**
	 * A callback that is fired when the selected radio item changes.
	 */
	onValueChange?: OnChangeFn<string>;
}>;

export type MenuRadioGroupProps = MenuRadioGroupPropsWithoutHTML & Without<BitsPrimitiveDivAttributes, MenuRadioGroupPropsWithoutHTML>;

export type MenuRadioItemSnippetProps = { checked: boolean };

export type MenuRadioItemPropsWithoutHTML = MenuItemPropsWithoutHTML<MenuRadioItemSnippetProps> & {
	/**
	 * The value of the radio item.
	 */
	value: string;
};

export type MenuRadioItemProps = MenuRadioItemPropsWithoutHTML & Without<BitsPrimitiveDivAttributes, MenuRadioItemPropsWithoutHTML>;

export type MenuPortalPropsWithoutHTML = PortalProps;
export type MenuPortalProps = MenuPortalPropsWithoutHTML;
