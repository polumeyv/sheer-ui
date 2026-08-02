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
		className,
	)}
	{...restProps}>
	<div class="grid gap-4">
		{@render children?.()}
	</div>
</ModalSurface>

<style>
	/* Pop is a keyframe animation, not an @starting-style / display / overlay transition: WebKit
	   doesn't start those on top-layer changes (bug 275184; `overlay` is Chromium-only), so
	   transitions snapped both directions on iOS. Exit plays REVERSED on [data-state=closed] while
	   the dialog is still open — the controller defers close() until animations settle. The
	   closed-state display reset and the ::backdrop fade live in ui.css under [data-modal-surface]. */
	/* Distinct in/out names on purpose: with a single name, the state flip only UPDATES the
	   already-finished entry animation (animation-name unchanged → no restart per spec), so the
	   exit would never play and the deferred close would fire instantly. */
	@keyframes dialog-pop-in {
		from {
			scale: 0.95;
			opacity: 0;
		}
	}
	@keyframes dialog-pop-out {
		to {
			scale: 0.95;
			opacity: 0;
		}
	}
	:global(.dialog-content[open][data-state='open']) {
		animation: dialog-pop-in 200ms cubic-bezier(0.4, 0, 0.2, 1);
	}
	:global(.dialog-content[open][data-state='closed']) {
		animation: dialog-pop-out 200ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}
</style>
