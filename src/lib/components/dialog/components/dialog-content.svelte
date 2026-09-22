<script lang="ts">
	import { join } from 'overrule';
	import ModalSurface from './modal-surface.svelte';
	import type { DialogContentProps } from '../types.js';

	// Keep layout utilities on the inner wrapper: display:grid on <dialog> overrides its closed state.
	let { children, ref = $bindable(null), class: className, ...restProps }: DialogContentProps = $props();
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
	/* Separate entry/exit keyframes restart reliably in WebKit. The controller keeps the dialog
	   open until exit settles; shared modal CSS owns the closed display reset and backdrop fade. */
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
