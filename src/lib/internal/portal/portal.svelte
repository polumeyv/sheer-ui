<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type PortalTarget = Element | ShadowRoot | string;

	export type PortalProps = {
		/**
		 * Where to portal the content to.
		 *
		 * @default document.body
		 */
		to?: PortalTarget;

		/**
		 * Disable portalling and render the component inline
		 *
		 * @defaultValue false
		 */
		disabled?: boolean;

		/**
		 * The children content to render within the portal.
		 */
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { resolvePortalToProp } from '../prop-resolvers.js';
	import { DEV } from 'esm-env';

	let { to: toProp, children, disabled }: PortalProps = $props();

	const to = resolvePortalToProp(() => toProp);
</script>

{#if disabled}
	{@render children?.()}
{:else}
	<div
		class="contents"
		{@attach (node) => {
			// Re-runs when `to` changes: svelte wraps the attachment in an effect, so the
			// to.current read here is a tracked dependency and a new target re-teleports the node.
			const t = to.current;
			const target = typeof t === 'string' ? document.querySelector(t) : t;
			// ShadowRoot (and other non-Element containers) take appendChild too
			if (!(target instanceof Element || target instanceof ShadowRoot)) {
				if (DEV) {
					if (typeof t === 'string') throw new Error(`Target element "${t}" not found.`);
					throw new TypeError(`Unknown portal target type: ${typeof t}. Allowed types: string (query selector), Element or ShadowRoot.`);
				}
				return;
			}
			target.appendChild(node);
			return () => node.remove();
		}}
	>
		{@render children?.()}
	</div>
{/if}
