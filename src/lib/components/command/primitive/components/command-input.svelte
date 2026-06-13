<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/toolbelt/index.js";
	import type { CommandInputProps } from "$lib/components/command/primitive/index.js";
	import { CommandInputState } from "$lib/components/command/primitive/command.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		value = $bindable(""),
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

	const mergedProps = $derived(mergeProps(restProps, inputState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<input {...mergedProps} bind:value />
{/if}
