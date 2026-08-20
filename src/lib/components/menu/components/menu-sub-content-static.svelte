<script lang="ts">
	import type { MenuSubContentStaticProps } from '../types.js';
	import MenuSubContent from './menu-sub-content.svelte';

	let { ref = $bindable(null), ...restProps }: MenuSubContentStaticProps = $props();
</script>

<MenuSubContent bind:ref {...restProps} isStatic />
