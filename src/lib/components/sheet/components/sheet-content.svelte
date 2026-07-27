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

<ModalSurface bind:ref data-slot="sheet-content" class={join('sheet-dialog', sheetVariants({ side }), className)} {...restProps}>
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

	/* The slide rides the variant's `transition` + duration utilities. Re-home transition-property
	   here (this UNLAYERED rule beats the layered Tailwind `transition`) so `display` + `overlay`
	   join `translate` with allow-discrete: that keeps the box in the top layer long enough for the
	   `data-[state=closed]:translate-…-full` EXIT to animate in Chromium. Firefox/Safari lack
	   `overlay` and snap the close (they still animate the OPEN via @starting-style) — the same
	   progressive-enhancement trade as Dialog/Popover. The closed-state display reset and the
	   ::backdrop fade live in ui.css under `[data-modal-surface]`; the fade duration is stretched
	   to match the 300ms slide via the custom property. */
	:global(.sheet-dialog) {
		transition-property: translate, transform, display, overlay;
		transition-behavior: allow-discrete;
		--modal-backdrop-duration: 300ms;
	}
</style>
