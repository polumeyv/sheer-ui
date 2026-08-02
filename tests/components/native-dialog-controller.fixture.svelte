<script lang="ts">
	import { nativeDialogControllerAttachment } from '#lib/internal/native-dialog-controller.svelte.js';
	import { untrack } from 'svelte';

	let {
		outsideEvent = 'pointerdown',
	}: {
		outsideEvent?: 'pointerdown' | 'click';
	} = $props();

	let open = $state(false);
	let closeCount = $state(0);
	let vetoOutside = $state(false);
	let vetoEscape = $state(false);
	let ignoreOutside = $state(false);
	let ignoreEscape = $state(false);
	let trapFocus = $state(true);

	export const setOpen = (value: boolean) => (open = value);
	export const setVetoOutside = (value: boolean) => (vetoOutside = value);
	export const setVetoEscape = (value: boolean) => (vetoEscape = value);
	export const setIgnoreOutside = (value: boolean) => (ignoreOutside = value);
	export const setIgnoreEscape = (value: boolean) => (ignoreEscape = value);
	export const setTrapFocus = (value: boolean) => (trapFocus = value);
	export const getCloseCount = () => closeCount;

	const controller = nativeDialogControllerAttachment({
		open: () => open,
		onClose: () => {
			// transition-guarded like the real root's handleClose: the deferred native close()
			// re-fires `close`, which must not double-count a dismissal
			if (!open) return;
			closeCount++;
			open = false;
		},
		outsideEvent: untrack(() => outsideEvent),
		onInteractOutside: () => (event) => {
			if (vetoOutside) event.preventDefault();
		},
		interactOutsideBehavior: () => (ignoreOutside ? 'ignore' : 'close'),
		onEscapeKeydown: () => (event) => {
			if (vetoEscape) event.preventDefault();
		},
		escapeKeydownBehavior: () => (ignoreEscape ? 'ignore' : 'close'),
		trapFocus: () => trapFocus,
	});
</script>

<dialog {...controller} data-testid="dialog">
	<button data-testid="first">First</button>
	<button data-testid="last">Last</button>
</dialog>
