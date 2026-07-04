<script lang="ts">
	import { Slider } from '../../lib/components/slider/index.js';

	let value = $state(50);
</script>

<div class="w-80">
	<Slider type="single" bind:value max={100} step={1} />
</div>
