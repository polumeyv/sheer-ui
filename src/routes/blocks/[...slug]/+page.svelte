<script lang="ts">
	import BlockDoc from '../block-doc.svelte';
	import { getBlockDemo } from '../_demos.js';

	let { data } = $props();
	const demo = $derived(getBlockDemo(data.meta.slug));
</script>

<BlockDoc meta={data.meta} {demo} />
