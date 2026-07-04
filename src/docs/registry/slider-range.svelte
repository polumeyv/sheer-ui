<script lang="ts" module>
	export const title = 'Range';
</script>

<script lang="ts">
	import { Slider } from '../../lib/components/slider/index.js';

	let value = $state([25, 75]);
</script>

<div class="w-80">
	<Slider type="multiple" bind:value max={100} step={1} />
</div>
