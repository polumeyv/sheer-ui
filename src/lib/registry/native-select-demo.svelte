<script lang="ts">
	import * as NativeSelect from '../components/native-select/index.js';

	let value = $state('');
</script>

<NativeSelect.Root bind:value placeholder="Select a fruit" widthClass="w-[180px]">
	<NativeSelect.OptGroup label="Fruits">
		<NativeSelect.Option value="apple">Apple</NativeSelect.Option>
		<NativeSelect.Option value="banana">Banana</NativeSelect.Option>
		<NativeSelect.Option value="blueberry">Blueberry</NativeSelect.Option>
		<NativeSelect.Option value="grapes">Grapes</NativeSelect.Option>
	</NativeSelect.OptGroup>
</NativeSelect.Root>
