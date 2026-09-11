<script lang="ts">
	import * as Dialog from '#lib/components/dialog/index.js';
	import * as Sheet from '#lib/components/sheet/index.js';
	import * as Drawer from '#lib/components/drawer/index.js';

	let {
		variant,
		onEscapeKeydown,
		onInteractOutside,
		onOpenAutoFocus,
		onCloseAutoFocus,
	}: {
		variant: 'dialog' | 'sheet' | 'drawer';
		onEscapeKeydown?: (event: KeyboardEvent) => void;
		onInteractOutside?: (event: PointerEvent) => void;
		onOpenAutoFocus?: (event: Event) => void;
		onCloseAutoFocus?: (event: Event) => void;
	} = $props();
	let open = $state(false);
	export const setOpen = (value: boolean) => (open = value);
	const Root = $derived(variant === 'sheet' ? Sheet.Root : Dialog.Root);
	const Content = $derived(variant === 'sheet' ? Sheet.Content : Dialog.Content);
</script>

<button data-testid="before">Before</button>
{#if variant === 'drawer'}
	<Drawer.Root {open} autoFocus shouldScaleBackground={false}>
		<Drawer.Content {onOpenAutoFocus} {onCloseAutoFocus}>
			<button data-testid="first">First</button>
			<Drawer.Close>Close</Drawer.Close>
		</Drawer.Content>
	</Drawer.Root>
{:else}
	<Root {open}>
		<Content {onEscapeKeydown} {onInteractOutside} trapFocus preventScroll>
			<button data-testid="first">First</button>
			<button data-testid="last">Last</button>
		</Content>
	</Root>
{/if}
