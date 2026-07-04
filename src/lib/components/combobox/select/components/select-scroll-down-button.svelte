<script lang="ts">
	import { boxWith, mountedAttachment } from '../../../../internal/tools/index.js';
	import { mergeProps } from '../../../../merge-props.js';
	import type { SelectScrollDownButtonProps } from '../types.js';
	import { SelectScrollDownButtonState } from '../select.svelte.js';
	import { createId } from '../../../../internal/create-id.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		delay = () => 50,
		child,
		children,
		...restProps
	}: SelectScrollDownButtonProps = $props();

	const scrollButtonState = SelectScrollDownButtonState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		delay: boxWith(() => delay),
	});

	const mergedProps = $derived(mergeProps(restProps, scrollButtonState.props));

	const mounted = mountedAttachment<HTMLElement>((m) => (scrollButtonState.scrollButtonState.mounted = m));
</script>

{#if scrollButtonState.canScrollDown}
	{#if child}
		{@render child({ props: mergeProps(restProps, mounted) })}
	{:else}
		<div {...mergeProps(mergedProps, mounted)}>
			{@render children?.()}
		</div>
	{/if}
{/if}
