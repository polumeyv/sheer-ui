<script lang="ts">
	import * as Checkbox from '../components/checkbox/index.js';
	import { Label } from '../components/label/index.js';

	let checked = $state(true);
</script>

<div class="flex items-center gap-2">
	<Checkbox.Root id="terms" bind:checked />
	<Label.Root for="terms">Accept terms and conditions</Label.Root>
</div>
