<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { AvatarFallbackProps } from '$lib/bits/avatar/types.js';
	import { AvatarFallbackState } from '$lib/bits/avatar/avatar.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { cn } from '../../utils';

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		class: className,
		...restProps
	}: AvatarFallbackProps = $props();

	const fallbackState = AvatarFallbackState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'avatar-fallback',
				class: cn('bg-muted flex size-full items-center justify-center rounded-full', className),
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
