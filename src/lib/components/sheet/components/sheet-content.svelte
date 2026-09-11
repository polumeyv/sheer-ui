<script lang="ts" module>
	import { join } from 'overrule';
	import { sheetVariants, type Side } from '../variants.js';
	export { sheetVariants, type Side };
</script>

<script lang="ts">
	import ModalSurface from '../../dialog/components/modal-surface.svelte';
	import type { DialogContentProps } from '../../dialog/types.js';
	import SheetClose from './sheet-close.svelte';
	import XIcon from '@lucide/svelte/icons/x';

	let {
		children,
		ref = $bindable(null),
		side = 'right',
		class: className,
		...restProps
	}: DialogContentProps & {
		side?: Side;
	} = $props();
</script>

<ModalSurface
	bind:ref
	data-slot="sheet-content"
	data-side={side}
	class={join('sheet-dialog', sheetVariants({ side }), className)}
	{...restProps}>
	{@render children?.()}
	<SheetClose
		class="ring-offset-background focus-visible:ring-ring absolute inset-e-4 top-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none">
		<XIcon class="size-4" />
		<span class="sr-only">Close</span>
	</SheetClose>
</ModalSurface>

<style>
	/* Reset UA sizing in the base layer so side-variant utilities still win.
	   An unlayered reset would override the variant insets and dimensions. */
	@layer base {
		:global(.sheet-dialog) {
			inset: auto;
			margin: 0;
			max-width: none;
			max-height: none;
			padding: 0;
		}
	}

	/* Separate entry/exit keyframes restart reliably in WebKit. Hold the off-screen exit until
	   the controller closes the dialog; the shared backdrop fade follows the slide duration. */
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
