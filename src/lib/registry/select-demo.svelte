<script lang="ts">
	// `components/select` is the headless bits primitive; `blocks/select` is the
	// styled, ready-to-use composition (trigger + popover content + items API).
	import { Select } from "../blocks/select/index.js";

	let value = $state("");

	const items = [
		{ value: "sveltekit", label: "SvelteKit" },
		{ value: "next", label: "Next.js" },
		{ value: "astro", label: "Astro" },
		{ value: "nuxt", label: "Nuxt.js" },
		{ value: "remix", label: "Remix" },
	];
</script>

<Select {items} bind:value placeholder="Select a framework" label="Framework" />
