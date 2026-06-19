<script lang="ts">
	import { boxWith, mergeProps } from "$lib/internal/toolbelt.js";
	import { ToolbarLinkState } from "../toolbar.svelte.js";
	import type { ToolbarLinkProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		href,
		child,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: ToolbarLinkProps = $props();

	const linkState = ToolbarLinkState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				"data-slot": "toolbar-link",
				class:
					"focus-visible:border-ring focus-visible:ring-ring/50 inline-flex items-center justify-center rounded-md text-sm font-medium underline-offset-4 transition-colors outline-none hover:underline focus-visible:ring-[3px]",
			},
			restProps,
			linkState.props
		)
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<a {href} {...mergedProps}>
		{@render children?.()}
	</a>
{/if}
