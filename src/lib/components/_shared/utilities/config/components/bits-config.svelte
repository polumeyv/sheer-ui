<script lang="ts">
	import type { BitsConfigProps } from "$lib/components/_shared/utilities/config/index";
	import { useBitsConfig } from "$lib/components/_shared/utilities/config/bits-config";
	let { children, defaultPortalTo, defaultLocale }: BitsConfigProps = $props();

	useBitsConfig({
		defaultPortalTo: { get current() { return defaultPortalTo; } },
		defaultLocale: { get current() { return defaultLocale; } },
	});
</script>

{@render children?.()}
