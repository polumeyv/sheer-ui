<script lang="ts">
	import { Portal, type PortalProps } from '../dialog/index.js';
	import { getDrawer } from '../../internal/vendor/vaul/context.js';

	const ctx = getDrawer();

	let { to = ctx.container.current ?? undefined, ...restProps }: PortalProps = $props();
</script>

<Portal {to} {...restProps} />
