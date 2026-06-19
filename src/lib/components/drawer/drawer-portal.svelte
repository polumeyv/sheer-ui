<script lang="ts">
import { Portal, type PortalProps } from '$lib/components/dialog/index.js';
import { DrawerContext } from './util/context.js';

const ctx = DrawerContext.get();

let { to = ctx.container.current ?? undefined, ...restProps }: PortalProps = $props();
</script>

<Portal {to} {...restProps} />
