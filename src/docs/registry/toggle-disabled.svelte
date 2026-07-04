<script lang="ts" module>
	export const title = 'Disabled';
</script>

<script lang="ts">
	import { Root as Toggle } from '../../lib/components/toggle/index.js';
	import Underline from '@lucide/svelte/icons/underline';
</script>

<Toggle disabled aria-label="Toggle underline">
	<Underline />
</Toggle>
