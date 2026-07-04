<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../merge-props.js';
	import type { MenubarContentStaticProps } from '../types.js';
	import { MenubarContentState } from '../menubar.svelte.js';
	import { createId } from '../../../internal/create-id.js';
	import MenuContentStatic from '../../../components/menu/components/menu-content-static.svelte';

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

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

<MenuContentStatic bind:ref {...mergedProps} {...contentState.popperProps} preventScroll={false} />
