<script lang="ts">
	import { mergeProps } from '$lib/vendor';
	import type { SwitchThumbProps } from '$lib/components/switch/primitive/index';
	import { SwitchThumbState } from '$lib/components/switch/primitive/switch.svelte';
	import { createId } from '$lib/vendor/create-id';

	const uid = $props.id();

	let { child, children, ref = $bindable(null), id = createId(uid), ...restProps }: SwitchThumbProps = $props();

	const thumbState = SwitchThumbState.create({
		id: {
			get current() {
				return id;
			},
		},
		ref: {
			get current() {
				return ref;
			},
			set current(v) {
				ref = v;
			},
		},
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
