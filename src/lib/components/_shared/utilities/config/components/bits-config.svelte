<script lang="ts">
	import type { BitsConfigProps } from "$lib/components/_shared/utilities/config/types.js";
	import { useBitsConfig } from "$lib/components/_shared/utilities/config/bits-config.js";
	import { boxWith } from "$lib/vendor/toolbelt/index.js";

	let { children, defaultPortalTo, defaultLocale }: BitsConfigProps = $props();

	useBitsConfig({
		defaultPortalTo: boxWith(() => defaultPortalTo),
		defaultLocale: boxWith(() => defaultLocale),
	});
</script>

{@render children?.()}
