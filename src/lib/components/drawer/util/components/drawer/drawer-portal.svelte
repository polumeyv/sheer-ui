<script lang="ts">
	import * as Dialog from "$lib/components/dialog/index.js";
	import { DrawerContext } from "../../context.js";

	const ctx = DrawerContext.get();

	let { to = ctx.container.current ?? undefined, ...restProps }: Dialog.PortalProps = $props();
</script>

<Dialog.Portal {to} {...restProps} />
