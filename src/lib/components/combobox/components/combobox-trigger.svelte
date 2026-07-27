<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { ComboboxTriggerProps } from '../types.js';
	import { createId } from '../../../internal/create-id.js';
	import { SelectComboTriggerState } from '../select/select.svelte.js';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';

	const uid = $props.id();

	let { id = createId(uid), ref = $bindable(null), child, children, type = 'button', ...restProps }: ComboboxTriggerProps = $props();

	const triggerState = SelectComboTriggerState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'combobox-trigger',
				class: 'text-muted-foreground absolute inset-e-0 top-0 grid h-10 w-10 place-items-center disabled:opacity-50',
			},
			restProps,
			triggerState.props,
			{ type },
		),
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{#if children}
			{@render children()}
		{:else}
			<ChevronsUpDownIcon class="size-4" />
		{/if}
	</button>
{/if}
