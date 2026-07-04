import type { EscapeLayerProps } from "../utilities/escape-layer/types.js";
import type { DismissibleLayerProps } from "../utilities/dismissible-layer/types.js";
import type { PresenceLayerProps } from "../utilities/presence-layer/types.js";
import type { FocusScopeProps } from "../utilities/focus-scope/types.js";
import type { TextSelectionLayerProps } from "../utilities/text-selection-layer/types.js";
import type { ScrollLockProps } from "../utilities/scroll-lock/index.js";
import type { Snippet } from "svelte";
import type {
	OnChangeFn,
	WithChild,
	WithChildNoChildrenSnippetProps,
	Without,
} from "../../internal/types.js";
import type {
	BitsPrimitiveButtonAttributes,
	BitsPrimitiveDivAttributes,
} from "../../internal/attributes.js";
import type { PortalProps } from "../../components/utilities/portal/index.js";
import type { DialogState } from "./dialog.svelte.js";

export type DialogRootPropsWithoutHTML = {
	/**
	 * The derivation source for the dialog's open state: the internal cell
	 * re-derives whenever this prop changes, and interactions (trigger, Escape,
	 * a snippet-cell write) override it until the next change. Reconcile
	 * dismissals via onOpenChangeComplete. Plain value — not bindable.
	 */
	open?: boolean;

	/**
	 * A callback called when the dialog finishes opening/closing animations.
	 * This is an occurrence (animation settled), not a state mirror — use it
	 * for dismissal-is-navigation flows, not to track `open` (depend on the
	 * cell instead).
	 */
	onOpenChangeComplete?: OnChangeFn<boolean>;

	/** Children receive the state cell, typed and guaranteed within the tree. */
	children?: Snippet<[DialogState]>;
};

export type DialogRootProps = DialogRootPropsWithoutHTML;

export type DialogContentSnippetProps = {
	open: boolean;
};

export type DialogContentPropsWithoutHTML = WithChildNoChildrenSnippetProps<
	Omit<
		EscapeLayerProps &
			Omit<DismissibleLayerProps, "onInteractOutsideStart"> &
			PresenceLayerProps &
			FocusScopeProps &
			TextSelectionLayerProps &
			ScrollLockProps,
		"loop"
	>,
	DialogContentSnippetProps
>;

export type DialogContentProps = DialogContentPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, DialogContentPropsWithoutHTML>;

export type DialogOverlaySnippetProps = {
	open: boolean;
};

export type DialogOverlayPropsWithoutHTML = WithChild<
	PresenceLayerProps,
	DialogOverlaySnippetProps
>;

export type DialogOverlayProps = DialogOverlayPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, DialogOverlayPropsWithoutHTML>;

export type DialogPortalPropsWithoutHTML = PortalProps;
export type DialogPortalProps = DialogPortalPropsWithoutHTML;

export type DialogTriggerPropsWithoutHTML = WithChild;

export type DialogTriggerProps = DialogTriggerPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, DialogTriggerPropsWithoutHTML>;

export type DialogTitlePropsWithoutHTML = WithChild<{
	/**
	 * The heading level of the dialog title.
	 */
	level?: 1 | 2 | 3 | 4 | 5 | 6;
}>;

export type DialogTitleProps = DialogTitlePropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, DialogTitlePropsWithoutHTML>;

export type DialogClosePropsWithoutHTML = DialogTriggerPropsWithoutHTML;
export type DialogCloseProps = DialogTriggerProps;

export type DialogDescriptionPropsWithoutHTML = WithChild;
export type DialogDescriptionProps = DialogDescriptionPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, DialogDescriptionPropsWithoutHTML>;
