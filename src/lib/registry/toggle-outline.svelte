<script lang="ts" module>
	export const title = 'Outline';
</script>

<script lang="ts">
	import { Root as Toggle } from '../components/toggle/index.js';
	import Italic from '@lucide/svelte/icons/italic';
</script>

<Toggle variant="outline" aria-label="Toggle italic">
	<Italic />
</Toggle>
