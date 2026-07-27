<script lang="ts">
	import { join } from 'overrule';
	import ModalSurface from './modal-surface.svelte';
	import type { DialogContentProps, DialogPortalProps } from '../types.js';
	import type { WithoutChildrenOrChild } from '../../../internal/utils.js';

	/**
	 * Modal dialog adapter over the shared native modal surface (modal-surface.svelte),
	 * which owns the skeleton: parity props, content state, controller, scroll lock, and
	 * the `<dialog>` render. This file owns only Dialog's visual policy.
	 *
	 * The visual surface (centered box, bg, border, radius, shadow, padding, sm:max-w-lg) is baked
	 * here — the shadcn convention — so a bare `<Dialog.Content>` is a styled modal; consumer
	 * `class` still merges to override (e.g. `max-w-md!`). Two Tailwind gotchas: no `display`
	 * utility on the <dialog> (grid lives on the inner wrapper); explicit centering via
	 * `fixed inset-0 m-auto h-fit` (preflight resets the UA `margin:auto` that would otherwise
	 * center it).
	 */
	let {
		children,
		ref = $bindable(null),
		class: className,
		...restProps
	}: DialogContentProps & {
		portalProps?: WithoutChildrenOrChild<DialogPortalProps>;
	} = $props();
</script>

<ModalSurface
	bind:ref
	data-slot="dialog-content"
	class={join(
		'dialog-content bg-background fixed inset-0 z-50 m-auto h-fit max-h-[calc(100dvh-2rem)] w-full max-w-[calc(100%-2rem)] overflow-y-auto rounded-lg border p-6 shadow-lg sm:max-w-lg',
		'scale-95 opacity-0 transition-[opacity,scale,display,overlay] transition-discrete duration-200',
		'open:scale-100 open:opacity-100 starting:open:scale-95 starting:open:opacity-0',
		className,
	)}
	{...restProps}>
	<div class="grid gap-4">
		{@render children?.()}
	</div>
</ModalSurface>

<style>
	/* The box + animation ride Tailwind utilities on the element; re-home transition-property here (this
	   UNLAYERED rule beats the layered Tailwind `transition`) so `display` + `overlay` join `scale`/
	   `opacity` with allow-discrete — that keeps the box in the top layer long enough for the CLOSE to
	   animate in Chromium. Firefox/Safari lack `overlay` and snap the close (they still animate the OPEN
	   via @starting-style) — the same progressive-enhancement trade as Sheet / Popover. The closed-state
	   display reset and the ::backdrop fade live in ui.css under `[data-modal-surface]`. */
	:global(.dialog-content) {
		transition-property: opacity, scale, display, overlay;
		transition-behavior: allow-discrete;
	}
</style>
