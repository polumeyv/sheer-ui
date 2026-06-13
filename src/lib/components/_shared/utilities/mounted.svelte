<script lang="ts">
	import { untrack } from "svelte";

	let {
		mounted = $bindable(false),
		onMountedChange = (() => {}),
	}: { mounted?: boolean; onMountedChange?: (mounted: boolean) => void } = $props();

	$effect(() => untrack(() => {
		mounted = true;
		onMountedChange(true);
		return () => {
			mounted = false;
			onMountedChange(false);
		};
	}));
</script>
