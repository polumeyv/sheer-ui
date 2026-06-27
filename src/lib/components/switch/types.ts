import type { OnChangeFn, WithChild, Without } from "$lib/internal/types.js";
import type {
	BitsPrimitiveButtonAttributes,
	BitsPrimitiveSpanAttributes,
} from "$lib/shared/attributes.js";

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
		 * Whether the switch is marked required (sets `aria-required`). This headless
		 * switch does not participate in forms — use the native switch for form validation.
		 *
		 * @defaultValue false
		 */
		required?: boolean;

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
	Without<BitsPrimitiveButtonAttributes, SwitchRootPropsWithoutHTML>;

export type SwitchThumbSnippetProps = SwitchRootSnippetProps;

export type SwitchThumbPropsWithoutHTML = WithChild<{}, SwitchThumbSnippetProps>;

export type SwitchThumbProps = SwitchThumbPropsWithoutHTML &
	Without<BitsPrimitiveSpanAttributes, SwitchThumbPropsWithoutHTML>;
