<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
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
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		value: { get current() { return value; }, set current(v) { value = v; } },
		autofocus: { get current() { return autofocus ?? false; } },
	});

	const mergedProps = $derived(mergeProps(restProps, inputState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<input {...mergedProps} bind:value />
{/if}
