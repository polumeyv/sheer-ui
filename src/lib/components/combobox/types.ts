import type { BitsPrimitiveInputAttributes } from '../../internal/attribute-types.js';
import type { LucideProps } from '@lucide/svelte';
import type {
	SelectMultipleRootPropsWithoutHTML,
	SelectSharedRootPropsWithoutHTML,
	SelectSingleRootPropsWithoutHTML,
} from './select/types.js';
import type { OnChangeFn, WithChild, WithChildren, Without } from '../../internal/types.js';

// Combobox keeps the pre-cell open contract (bindable open + onOpenChange); its
// open-cell migration is a later slice of the rollout.
export type ComboboxBaseRootPropsWithoutHTML = WithChildren<
	Omit<SelectSharedRootPropsWithoutHTML, 'autocomplete'> & {
		/**
		 * Whether the combobox popover is open.
		 *
		 * @defaultValue `false`
		 * @bindable
		 */
		open?: boolean;

		/**
		 * A callback function called when the open state changes.
		 */
		onOpenChange?: OnChangeFn<boolean>;
	}
> & {
	/**
	 * A read-only value that can be used to programmatically
	 * update the input value.
	 *
	 * This is useful for updating the displayed label/input
	 * when the value changes outside of Bits UI.
	 */
	inputValue?: string;
};

export type ComboboxSingleRootPropsWithoutHTML = ComboboxBaseRootPropsWithoutHTML & SelectSingleRootPropsWithoutHTML;

export type ComboboxSingleRootProps = ComboboxSingleRootPropsWithoutHTML;

export type ComboboxMultipleRootPropsWithoutHTML = ComboboxBaseRootPropsWithoutHTML & SelectMultipleRootPropsWithoutHTML;
export type ComboboxMultipleRootProps = ComboboxMultipleRootPropsWithoutHTML;

export type ComboboxRootPropsWithoutHTML = ComboboxBaseRootPropsWithoutHTML &
	(ComboboxSingleRootPropsWithoutHTML | ComboboxMultipleRootPropsWithoutHTML);

export type ComboboxRootProps = ComboboxRootPropsWithoutHTML;

export type {
	SelectContentProps as ComboboxContentProps,
	SelectContentPropsWithoutHTML as ComboboxContentPropsWithoutHTML,
	SelectContentStaticProps as ComboboxContentStaticProps,
	SelectContentStaticPropsWithoutHTML as ComboboxContentStaticPropsWithoutHTML,
	SelectItemProps as ComboboxItemProps,
	SelectItemPropsWithoutHTML as ComboboxItemPropsWithoutHTML,
	SelectItemSnippetProps as ComboboxItemSnippetProps,
	SelectTriggerProps as ComboboxTriggerProps,
	SelectTriggerPropsWithoutHTML as ComboboxTriggerPropsWithoutHTML,
	SelectGroupPropsWithoutHTML as ComboboxGroupPropsWithoutHTML,
	SelectGroupProps as ComboboxGroupProps,
	SelectGroupHeadingPropsWithoutHTML as ComboboxGroupHeadingPropsWithoutHTML,
	SelectGroupHeadingProps as ComboboxGroupHeadingProps,
	SelectViewportPropsWithoutHTML as ComboboxViewportPropsWithoutHTML,
	SelectViewportProps as ComboboxViewportProps,
	SelectScrollDownButtonProps as ComboboxScrollDownButtonProps,
	SelectScrollDownButtonPropsWithoutHTML as ComboboxScrollDownButtonPropsWithoutHTML,
	SelectScrollUpButtonProps as ComboboxScrollUpButtonProps,
	SelectScrollUpButtonPropsWithoutHTML as ComboboxScrollUpButtonPropsWithoutHTML,
	SelectPortalProps as ComboboxPortalProps,
	SelectPortalPropsWithoutHTML as ComboboxPortalPropsWithoutHTML,
} from './select/types.js';

export type ComboboxArrowPropsWithoutHTML = LucideProps;

export type ComboboxArrowProps = ComboboxArrowPropsWithoutHTML;

export type ComboboxInputPropsWithoutHTML = WithChild<{
	/**
	 * The default value of the input. This is not a reactive prop and is only used to populate
	 * the input when the combobox is first mounted if there is already a value set.
	 */
	defaultValue?: string;

	/**
	 * Whether to clear the input when the last item is deselected.
	 *
	 * @default false
	 */
	clearOnDeselect?: boolean;
}>;

export type ComboboxInputProps = ComboboxInputPropsWithoutHTML &
	Without<Omit<BitsPrimitiveInputAttributes, 'value'>, ComboboxInputPropsWithoutHTML>;
