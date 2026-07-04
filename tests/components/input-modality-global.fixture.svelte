<script lang="ts">
	import { useGlobalInputModality } from '$lib/internal/input-modality/input-modality.svelte.js';

	const modality = useGlobalInputModality();
</script>

<div data-testid="is-keyboard">{modality.isKeyboard}</div>
