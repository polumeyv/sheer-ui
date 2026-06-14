import type { EscapeLayerProps } from "$lib/components/_shared/utilities/escape-layer/index";
import type { DismissibleLayerProps } from "$lib/components/_shared/utilities/dismissible-layer/index";
import type { PresenceLayerProps } from "$lib/components/_shared/utilities/presence-layer/index";
import type { FocusScopeProps } from "$lib/components/_shared/utilities/focus-scope/index";
import type { TextSelectionLayerProps } from "$lib/components/_shared/utilities/text-selection-layer/index";
import type { ScrollLockProps } from "$lib/components/_shared/utilities/scroll-lock/index";
import type {
	OnChangeFn,
	WithChild,
	WithChildNoChildrenSnippetProps,
	WithChildren,
	Without,
} from "$lib/vendor/types";
import type {
	BitsPrimitiveButtonAttributes,
	BitsPrimitiveDivAttributes,
} from "$lib/shared/attributes";
import type { PortalProps } from "$lib/components/_shared/utilities/portal/index";

export type DialogRootPropsWithoutHTML = WithChildren<{
	/**
	 * The open state of the dialog.
	 */
	open?: boolean;

	/**
	 * A callback that is called when the popover's open state changes.
	 */
	onOpenChange?: OnChangeFn<boolean>;

	/**
	 * A callback called when the dialog finishes opening/closing animations.
	 */
	onOpenChangeComplete?: OnChangeFn<boolean>;
}>;

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

export { default as Root } from './root.svelte';
export { default as Content } from './content.svelte';
export { default as Overlay } from './overlay.svelte';
export { default as Trigger } from './trigger.svelte';
export { default as Close } from './close.svelte';
export { default as Title } from './title.svelte';
export { default as Description } from './description.svelte';
export { default as Portal } from '$lib/components/_shared/utilities/portal/portal.svelte';

export * as Dialog from '$lib/components/dialog/primitive/exports';


export type {
	DialogRootProps as RootProps,
	DialogContentProps as ContentProps,
	DialogOverlayProps as OverlayProps,
	DialogTriggerProps as TriggerProps,
	DialogCloseProps as CloseProps,
	DialogTitleProps as TitleProps,
	DialogDescriptionProps as DescriptionProps,
	DialogPortalProps as PortalProps,
};
