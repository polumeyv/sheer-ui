<script lang="ts" module>
	export const title = 'Theme Tiles (Appearance block)';
</script>

<script lang="ts">
	// The Appearance block is the real-world card-selection pattern for the radio
	// group: each SVG tile is a label wrapping the item, so clicking anywhere on
	// the card selects it. It drives the live theme, same as the header toggle.
	import Appearance from '../../lib/blocks/Appearance.svelte';
</script>

<Appearance />
