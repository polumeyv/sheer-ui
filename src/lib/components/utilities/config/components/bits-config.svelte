<script lang="ts">
	import type { BitsConfigProps } from "$lib/components/utilities/config/types.js";
	import { useBitsConfig } from "../bits-config.js";
	import { boxWith } from "$lib/internal/toolbelt.js";

	let { children, defaultPortalTo, defaultLocale }: BitsConfigProps = $props();

	useBitsConfig({
		defaultPortalTo: boxWith(() => defaultPortalTo),
		defaultLocale: boxWith(() => defaultLocale),
	});
</script>

{@render children?.()}
