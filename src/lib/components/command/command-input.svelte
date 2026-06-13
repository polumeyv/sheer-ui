<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/index.js';
	import type { CommandInputProps } from '$lib/components/command/primitive/index.js';
	import { CommandInputState } from '$lib/components/command/primitive/command.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import SearchIcon from '@lucide/svelte/icons/search';
	import { cn } from '../../vendor/utils';

	const uid = $props.id();

	let {
		value = $bindable(''),
		autofocus = false,
		id = createId(uid),
		ref = $bindable(null),
		child,
		class: className,
		...restProps
	}: CommandInputProps = $props();

	const inputState = CommandInputState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		value: boxWith(
			() => value,
			(v) => {
				value = v;
			}
		),
		autofocus: boxWith(() => autofocus ?? false),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'command-input',
				class: cn(
					'placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
					className
				),
			},
			restProps,
			inputState.props
		)
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
