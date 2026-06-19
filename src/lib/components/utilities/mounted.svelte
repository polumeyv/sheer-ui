<script lang="ts">
	import { onMountEffect } from "$lib/internal/toolbelt.js";

	let {
		mounted = $bindable(false),
		onMountedChange = () => {},
	}: { mounted?: boolean; onMountedChange?: (mounted: boolean) => void } = $props();

	onMountEffect(() => {
		mounted = true;
		onMountedChange(true);
		return () => {
			mounted = false;
			onMountedChange(false);
		};
	});
</script>
