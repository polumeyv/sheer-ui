<script lang="ts" module>
	export const title = "Sizes";
</script>

<script lang="ts">
	import { Button } from "../components/button/index.js";
	import Plus from "@lucide/svelte/icons/plus";
</script>

<div class="flex flex-wrap items-center gap-3">
	<Button size="sm">Small</Button>
	<Button size="default">Default</Button>
	<Button size="lg">Large</Button>
	<Button size="icon" aria-label="Add"><Plus /></Button>
</div>
