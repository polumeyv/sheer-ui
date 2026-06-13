<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/toolbelt/index.js";
	import type { SwitchThumbProps } from "$lib/components/switch/primitive/types.js";
	import { SwitchThumbState } from "$lib/components/switch/primitive/switch.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		child,
		children,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: SwitchThumbProps = $props();

	const thumbState = SwitchThumbState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, thumbState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...thumbState.snippetProps })}
{:else}
	<span {...mergedProps}>
		{@render children?.(thumbState.snippetProps)}
	</span>
{/if}
