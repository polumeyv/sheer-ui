<script lang="ts">
	import { getAllContexts, mount, unmount, untrack } from 'svelte';
	import { DEV } from 'esm-env';
	import PortalConsumer from './portal-consumer.svelte';
	import type { PortalProps } from './types.js';
	import { isBrowser } from '@polumeyv/utilities/dom';
	import { resolvePortalToProp } from '../config/prop-resolvers.js';

	let { to: toProp, children, disabled }: PortalProps = $props();

	const to = resolvePortalToProp(() => toProp);
	const context = getAllContexts();

	let target = $derived(getTarget());

	function getTarget() {
		if (!isBrowser || disabled) return null;

		let localTarget: Element | null = null;

		if (typeof to.current === 'string') {
			const target = document.querySelector(to.current);
			if (DEV && target === null) {
				throw new Error(`Target element "${to.current}" not found.`);
			}
			localTarget = target;
		} else {
			localTarget = to.current;
		}

		if (DEV && !(localTarget instanceof Element)) {
			const type = localTarget === null ? 'null' : typeof localTarget;
			throw new TypeError(`Unknown portal target type: ${type}. Allowed types: string (query selector) or Element.`);
		}

		return localTarget;
	}

	let instance: ReturnType<typeof mount> | null;

	function unmountInstance() {
		if (instance) {
			unmount(instance);
			instance = null;
		}
	}

	$effect(() => {
		target;
		disabled;
		return untrack(() => {
			if (!target || disabled) {
				unmountInstance();
				return;
			}
			instance = mount(PortalConsumer, {
				target: target,
				props: { children },
				context,
			});

			return () => {
				unmountInstance();
			};
		});
	});
</script>

{#if disabled}
	{@render children?.()}
{/if}
