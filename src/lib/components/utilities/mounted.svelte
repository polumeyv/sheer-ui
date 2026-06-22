<script lang="ts">
	import { onMount } from "svelte";

	let {
		mounted = $bindable(false),
		onMountedChange = () => {},
	}: { mounted?: boolean; onMountedChange?: (mounted: boolean) => void } = $props();

	onMount(() => {
		mounted = true;
		onMountedChange(true);
		return () => {
			mounted = false;
			onMountedChange(false);
		};
	});
</script>
