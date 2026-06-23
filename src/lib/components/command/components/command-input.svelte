<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import type { CommandInputProps } from '../types.js';
	import { CommandInputState } from '../command.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import SearchIcon from '@lucide/svelte/icons/search';

	const uid = $props.id();

	let {
		value = $bindable(''),
		autofocus = false,
		id = createId(uid),
		ref = $bindable(null),
		child,
		...restProps
	}: CommandInputProps = $props();

	const inputState = CommandInputState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		value: boxWith(
			() => value,
			(v) => {
				value = v;
			},
		),
		autofocus: boxWith(() => autofocus ?? false),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'command-input',
				class:
					'placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
			},
			restProps,
			inputState.props,
		),
	);
</script>

<div class="flex h-9 items-center gap-2 border-b ps-3 pe-8" data-slot="command-input-wrapper">
	<SearchIcon class="size-4 shrink-0 opacity-50" />
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<input {...mergedProps} bind:value />
	{/if}
</div>
