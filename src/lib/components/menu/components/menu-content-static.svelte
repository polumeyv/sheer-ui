<script lang="ts">
	import type { MenuContentStaticProps } from '../types.js';
	import MenuContent from './menu-content.svelte';

	let { ref = $bindable(null), ...restProps }: MenuContentStaticProps = $props();
</script>

<MenuContent bind:ref {...restProps} isStatic />
