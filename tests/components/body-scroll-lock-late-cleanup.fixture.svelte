<script lang="ts">
	import { scrollLockAttachment } from '../../src/lib/internal/body-scroll-lock.svelte.js';

	let { restoreScrollDelay = null }: { restoreScrollDelay?: number | null } = $props();

	const lock = scrollLockAttachment({ restoreScrollDelay: () => restoreScrollDelay });
</script>

<div {...lock}></div>
