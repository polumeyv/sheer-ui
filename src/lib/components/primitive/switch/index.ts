import type { OnChangeFn, WithChild, Without } from '$lib/vendor/types';
import type { BitsPrimitiveSpanAttributes } from '$lib/shared/attributes';

type SwitchRootSnippetProps = {
	checked: boolean;
};

export type SwitchRootPropsWithoutHTML = WithChild<
	{
		/**
		 * Whether the switch is disabled.
		 *
		 * @defaultValue false
		 */
		disabled?: boolean | null | undefined;

		/**
		 * Whether the switch is required for form validation.
		 *
		 * @defaultValue false
		 */
		required?: boolean;

		/**
		 * The name of the switch used in form submission.
		 *
		 * @defaultValue undefined
		 */
		name?: string;

		/**
		 * The value of the switch used in form submission.
		 *
		 * @defaultValue "on"
		 */
		value?: string;

		/**
		 * The checked state of the switch.
		 *
		 * @defaultValue false
		 */
		checked?: boolean;

		/**
		 * A callback function called when the checked state changes.
		 */
		onCheckedChange?: OnChangeFn<boolean>;
	},
	SwitchRootSnippetProps
>;

export type SwitchRootProps = SwitchRootPropsWithoutHTML &
	Without<BitsPrimitiveSpanAttributes, SwitchRootPropsWithoutHTML>;

export type SwitchThumbSnippetProps = SwitchRootSnippetProps;

export type SwitchThumbPropsWithoutHTML = WithChild<{}, SwitchThumbSnippetProps>;

export type SwitchThumbProps = SwitchThumbPropsWithoutHTML &
	Without<BitsPrimitiveSpanAttributes, SwitchThumbPropsWithoutHTML>;