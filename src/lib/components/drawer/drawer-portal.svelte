<script lang="ts">
import { Portal, type PortalProps } from '$lib/components/dialog/index.js';
import { getDrawer } from './util/context.js';

const ctx = getDrawer();

let { to = ctx.container.current ?? undefined, ...restProps }: PortalProps = $props();
</script>

<Portal {to} {...restProps} />
