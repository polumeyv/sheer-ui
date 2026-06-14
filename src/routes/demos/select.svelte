<script lang="ts">
	import * as Select from '$lib/components/select/index';

	let value = $state('');
</script>

<Select.Root bind:value placeholder="Select a fruit" class="w-full max-w-sm">
	<Select.OptGroup label="Citrus">
		<Select.Option value="orange">Orange</Select.Option>
		<Select.Option value="lemon">Lemon</Select.Option>
		<Select.Option value="grapefruit">Grapefruit</Select.Option>
	</Select.OptGroup>
	<Select.OptGroup label="Berries">
		<Select.Option value="strawberry">Strawberry</Select.Option>
		<Select.Option value="blueberry">Blueberry</Select.Option>
		<Select.Option value="raspberry">Raspberry</Select.Option>
	</Select.OptGroup>
</Select.Root>
