<script lang="ts">
	import type { BitsConfigProps } from "$lib/components/_shared/utilities/config/index.js";
	import { useBitsConfig } from "$lib/components/_shared/utilities/config/bits-config.js";
	import { boxWith } from "$lib/vendor/index.js";

	let { children, defaultPortalTo, defaultLocale }: BitsConfigProps = $props();

	useBitsConfig({
		defaultPortalTo: boxWith(() => defaultPortalTo),
		defaultLocale: boxWith(() => defaultLocale),
	});
</script>

{@render children?.()}
