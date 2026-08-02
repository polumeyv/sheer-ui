<script lang="ts" module>
	import { join } from 'overrule';
	import { sheetVariants, type Side } from '../variants.js';
	export { sheetVariants, type Side };
</script>

<script lang="ts">
	import ModalSurface from '../../dialog/components/modal-surface.svelte';
	import type { DialogContentProps, DialogPortalProps } from '../../dialog/types.js';
	import type { WithoutChildrenOrChild } from '../../../internal/utils.js';
	import SheetClose from './sheet-close.svelte';
	import XIcon from '@lucide/svelte/icons/x';

	/**
	 * Side panel adapter over the shared native modal surface (modal-surface.svelte),
	 * which owns the skeleton: parity props, content state, controller, scroll lock, and
	 * the `<dialog>` render. This file owns only Sheet's visual policy.
	 *
	 * The slide + per-side positioning come from `sheetVariants({ side })`; `data-state`
	 * (from DialogContentState.props) drives its `data-[state=closed]:translate-…-full` exit.
	 */
	let {
		children,
		ref = $bindable(null),
		side = 'right',
		class: className,
		...restProps
	}: DialogContentProps & {
		side?: Side;
		portalProps?: WithoutChildrenOrChild<DialogPortalProps>;
	} = $props();
</script>

<ModalSurface bind:ref data-slot="sheet-content" data-side={side} class={join('sheet-dialog', sheetVariants({ side }), className)} {...restProps}>
	{@render children?.()}
	<SheetClose
		class="ring-offset-background focus-visible:ring-ring absolute inset-e-4 top-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none">
		<XIcon class="size-4" />
		<span class="sr-only">Close</span>
	</SheetClose>
</ModalSurface>

<style>
	/* Neutralise the UA modal-dialog box defaults (`inset:0`, `margin:auto`, the `max-width/height`
	   caps) so the side variant's `inset-… h-full w-3/4 sm:max-w-sm` utilities own positioning + size.
	   Kept in @layer base on purpose: it beats the UA origin but still LOSES to the variant's Tailwind
	   utilities. An UNLAYERED reset would clobber the variant's inset/size — and because the variant
	   sets only 3 of the 4 insets, the UA's 4th (`left:0` for a right sheet) would otherwise leak
	   through and left-anchor the panel at full width. */
	@layer base {
		:global(.sheet-dialog) {
			inset: auto;
			margin: 0;
			max-width: none;
			max-height: none;
			padding: 0;
		}
	}

	/* The slide is a keyframe animation, not an @starting-style / display / overlay transition:
	   WebKit doesn't start those on top-layer changes (bug 275184; `overlay` is Chromium-only), so
	   transitions snapped both directions on iOS. Keyframes start reliably whenever the element is
	   newly rendered. Entry plays on [data-state=open]; exit plays REVERSED on [data-state=closed]
	   while the dialog is still open — the controller defers close() until animations settle —
	   with `forwards` holding the off-screen end state until the real close hides it. The
	   closed-state display reset and the ::backdrop fade live in ui.css under
	   `[data-modal-surface]`; the fade duration matches the 300ms slide via the custom property. */
	/* Distinct in/out names on purpose: with a single name, the state flip only UPDATES the
	   already-finished entry animation (animation-name unchanged → no restart per spec), so the
	   exit would never play and the deferred close would fire instantly. */
	@keyframes sheet-slide-in {
		from {
			translate: var(--sheet-from);
		}
	}
	@keyframes sheet-slide-out {
		to {
			translate: var(--sheet-from);
		}
	}
	:global(.sheet-dialog) {
		--modal-backdrop-duration: 300ms;
	}
	:global(.sheet-dialog[open][data-state='open']) {
		animation: sheet-slide-in 500ms cubic-bezier(0.4, 0, 0.2, 1);
	}
	:global(.sheet-dialog[open][data-state='closed']) {
		animation: sheet-slide-out 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}
	:global(.sheet-dialog[data-side='top']) {
		--sheet-from: 0 -100%;
	}
	:global(.sheet-dialog[data-side='bottom']) {
		--sheet-from: 0 100%;
	}
	:global(.sheet-dialog[data-side='left']) {
		--sheet-from: -100% 0;
	}
	:global(.sheet-dialog[data-side='right']) {
		--sheet-from: 100% 0;
	}
	:global([dir='rtl'] .sheet-dialog[data-side='left']) {
		--sheet-from: 100% 0;
	}
	:global([dir='rtl'] .sheet-dialog[data-side='right']) {
		--sheet-from: -100% 0;
	}
</style>
