<script lang="ts">
import DrawerRoot from './drawer.svelte';
import type { RootProps } from './util/components/drawer/index.js';
import { getDrawer } from './util/context.js';
import { noop } from './util/internal/noop.js';

let {
	shouldScaleBackground = true,
	open = $bindable(false),
	activeSnapPoint = $bindable(null),
	onOpenChange = noop,
	onDrag = noop,
	...restProps
}: Omit<RootProps, 'nested' | 'onRelease' | 'onClose'> = $props();

const rootState = getDrawer();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rest = $derived(restProps) as any;
</script>

<DrawerRoot
	{shouldScaleBackground}
	bind:activeSnapPoint
	bind:open
	nested
	onClose={() => rootState.onNestedOpenChange(false)}
	onDrag={(e, p) => {
		rootState.onNestedDrag(e, p);
		onDrag(e, p);
	}}
	onOpenChange={(o) => {
		if (o) {
			rootState.onNestedOpenChange(o);
		}
		onOpenChange(o);
	}}
	onRelease={rootState.onNestedRelease}
	{...rest}
/>
