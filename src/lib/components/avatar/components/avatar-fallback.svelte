<script lang="ts">
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { AvatarFallbackProps } from '../types.js';
	import { AvatarFallbackState } from '../avatar.svelte.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let { children, child, id = createId(uid), ref = $bindable(null), ...restProps }: AvatarFallbackProps = $props();

	const fallbackState = AvatarFallbackState.create({
		get id() {
			return id;
		},
		get ref() {
			return ref;
		},
		set ref(v) {
			ref = v;
		},
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'avatar-fallback',
				class: 'bg-muted grid size-full place-items-center rounded-full',
			},
			restProps,
			fallbackState.props,
		),
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>
		{@render children?.()}
	</span>
{/if}
