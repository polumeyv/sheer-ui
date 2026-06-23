<script lang="ts">
	import ComponentDoc from '../component-doc.svelte';

	let { data } = $props();
</script>

<ComponentDoc {...data} />
