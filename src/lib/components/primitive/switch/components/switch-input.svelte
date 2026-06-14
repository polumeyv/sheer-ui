<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import { SwitchInputState } from '$lib/components/primitive/switch/switch.svelte';

	const inputState = SwitchInputState.create();
</script>

<input
	type="checkbox"
	{...mergeProps(
		{
			'data-slot': 'switch-input',
			class: 'peer absolute inset-0 z-10 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed',
		},
		inputState.props,
	)}
	bind:checked={inputState.getChecked, inputState.setChecked} />
