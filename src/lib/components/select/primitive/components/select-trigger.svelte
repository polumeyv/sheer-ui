<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import { SelectTriggerState } from "$lib/components/select/primitive/select.svelte.js";
	import type { SelectTriggerProps } from "$lib/components/select/primitive/index.js";
	import { createId } from "$lib/internal/create-id.js";
	import { FloatingLayer } from "$lib/components/_shared/utilities/floating-layer/index.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		children,
		type = "button",
		...restProps
	}: SelectTriggerProps = $props();

	const triggerState = SelectTriggerState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props, { type }));
</script>

<FloatingLayer.Anchor {id} ref={triggerState.opts.ref}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<button {...mergedProps}>
			{@render children?.()}
		</button>
	{/if}
</FloatingLayer.Anchor>
