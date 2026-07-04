<script lang="ts">
	import * as Select from '../components/select/index.js';

	let value = $state('');
</script>

<Select.Root bind:value placeholder="Select a fruit" widthClass="w-[180px]">
	<Select.OptGroup label="Fruits">
		<Select.Option value="apple">Apple</Select.Option>
		<Select.Option value="banana">Banana</Select.Option>
		<Select.Option value="blueberry">Blueberry</Select.Option>
		<Select.Option value="grapes">Grapes</Select.Option>
	</Select.OptGroup>
</Select.Root>
