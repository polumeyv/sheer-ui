<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { MenubarContentStaticProps } from '../types.js';
	import { MenubarContentState } from '../menubar.svelte.js';
	import { createId } from '../../../internal/create-id.js';
	import { getFloatingContentCSSVars } from '../../../internal/floating-svelte/floating-utils.svelte.js';
	import MenuContent from '../../menu/components/menu-content.svelte';

	const uid = $props.id();

	let {
		ref = $bindable(null),
		interactOutsideBehavior = 'close',
		id = createId(uid),
		onInteractOutside = () => {},
		onCloseAutoFocus = () => {},
		onFocusOutside = () => {},
		onOpenAutoFocus = () => {},
		...restProps
	}: MenubarContentStaticProps = $props();

	const contentState = MenubarContentState.create({
		id: boxWith(() => id),
		interactOutsideBehavior: boxWith(() => interactOutsideBehavior),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		onInteractOutside: boxWith(() => onInteractOutside),
		onFocusOutside: boxWith(() => onFocusOutside),
		onCloseAutoFocus: boxWith(() => onCloseAutoFocus),
		onOpenAutoFocus: boxWith(() => onOpenAutoFocus),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'menubar-content',
				class:
					'bg-popover text-popover-foreground transition-[opacity,scale,translate] starting:opacity-0 starting:scale-95 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data-[side=bottom]:starting:-translate-y-2 data-[side=top]:starting:translate-y-2 data-[side=left]:starting:translate-x-2 data-[side=right]:starting:-translate-x-2 z-50 min-w-48 origin-(--bits-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-md outline-none',
				style: getFloatingContentCSSVars('menu'),
			},
			restProps,
			contentState.props,
		),
	);
</script>

<MenuContent bind:ref {...mergedProps} {...contentState.popperProps} preventScroll={false} isStatic />
