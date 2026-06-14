<script lang="ts">
	import type { ScrollLockProps } from "$lib/components/_shared/utilities/scroll-lock/index";
	import { BodyScrollLock } from "$lib/vendor/body-scroll-lock.svelte";

	let { preventScroll = true, restoreScrollDelay = null }: ScrollLockProps = $props();

	if (preventScroll) {
		new BodyScrollLock(preventScroll, () => restoreScrollDelay);
	}
</script>
