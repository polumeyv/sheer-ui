<script lang="ts">
	import { boxWith, mergeProps } from "$lib/internal/toolbelt.js";
	import type { AccordionTriggerProps } from "../types.js";
	import { AccordionTriggerState } from "../accordion.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import AccordionHeader from "./accordion-header.svelte";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";

	const uid = $props.id();

	let {
		disabled = false,
		ref = $bindable(null),
		id = createId(uid),
		tabindex = 0,
		children,
		child,
		...restProps
	}: AccordionTriggerProps = $props();

	const triggerState = AccordionTriggerState.create({
		disabled: boxWith(() => disabled),
		id: boxWith(() => id),
		tabindex: boxWith(() => tabindex ?? 0),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				"data-slot": "accordion-trigger",
				class:
					"focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
			},
			restProps,
			triggerState.props
		)
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<AccordionHeader class="flex">
		<button type="button" {...mergedProps}>
			{@render children?.()}
			<ChevronDownIcon
				class="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
		</button>
	</AccordionHeader>
{/if}
