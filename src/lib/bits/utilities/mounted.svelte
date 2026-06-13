<script lang="ts">
	import { onMountEffect } from "$lib/vendor/toolbelt/index.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		mounted = $bindable(false),
		onMountedChange = noop,
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
