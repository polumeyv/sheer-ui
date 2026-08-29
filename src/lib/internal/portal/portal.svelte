<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type PortalTarget = Element | string;

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
	import { BROWSER, DEV } from 'esm-env';

	let { to: toProp, children, disabled }: PortalProps = $props();

	const to = resolvePortalToProp(() => toProp);

	// Teleports the rendered node into the resolved target on mount and removes it on
	// cleanup. Runs in an effect, so it re-targets automatically when `to` changes (e.g. a
	// viewport ref that populates later). The wrapper carries `display: contents`, so it adds
	// no box of its own — the content lays out as if it were a direct child of the target.
	function portal(node: HTMLElement) {
		if (!BROWSER || disabled) return;

		const t = to.current;
		let target: Element | null;
		if (typeof t === 'string') {
			target = document.querySelector(t);
			if (DEV && target === null) {
				throw new Error(`Target element "${t}" not found.`);
			}
		} else {
			target = t;
			if (DEV && !(target instanceof Element)) {
				throw new TypeError(`Unknown portal target type: ${typeof target}. Allowed types: string (query selector) or Element.`);
			}
		}

		if (!target) return;
		target.appendChild(node);
		return () => node.remove();
	}
</script>

{#if disabled}
	{@render children?.()}
{:else}
	<div class="contents" {@attach portal}>
		{@render children?.()}
	</div>
{/if}
