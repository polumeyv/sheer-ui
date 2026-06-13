<script lang="ts">
	import type { BitsConfigProps } from "$lib/components/_shared/utilities/config/index.js";
	import { useBitsConfig } from "$lib/components/_shared/utilities/config/bits-config.js";
	let { children, defaultPortalTo, defaultLocale }: BitsConfigProps = $props();

	useBitsConfig({
		defaultPortalTo: { get current() { return defaultPortalTo; } },
		defaultLocale: { get current() { return defaultLocale; } },
	});
</script>

{@render children?.()}
