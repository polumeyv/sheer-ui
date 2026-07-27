<script lang="ts">
import DrawerRoot from './drawer.svelte';
import type { RootProps } from '../../internal/vendor/vaul/components/drawer/index.js';
import { OpenCell } from '../../internal/open-cell.svelte.js';
import { getDrawer } from '../../internal/vendor/vaul/context.js';
import { noop } from '@polumeyv/utilities';

let {
	shouldScaleBackground = true,
	open = false,
	state: givenCell,
	activeSnapPoint = $bindable(null),
	onDrag = noop,
	...restProps
}: Omit<RootProps, 'nested' | 'onRelease' | 'onClose' | 'open' | 'onOpenChange'> & {
	/** Derivation source for the nested drawer's open state. Not bindable. */
	open?: boolean;
	/** A caller-constructed cell used instead of building one from `open`. */
	state?: OpenCell;
} = $props();

const rootState = getDrawer();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rest = $derived(restProps) as any;

// svelte-ignore state_referenced_locally
const cell = givenCell ?? new OpenCell(() => open);
</script>

<DrawerRoot
	{shouldScaleBackground}
	bind:activeSnapPoint
	state={cell}
	nested
	onClose={() => rootState.onNestedOpenChange(false)}
	onDrag={(e, p) => {
		rootState.onNestedDrag(e, p);
		onDrag(e, p);
	}}
	_internal_onOpenChange={(o) => {
		if (o) rootState.onNestedOpenChange(o);
	}}
	onRelease={rootState.onNestedRelease}
	{...rest}
/>
