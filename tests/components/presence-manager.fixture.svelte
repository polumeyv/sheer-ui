<script lang="ts">
	import { boxWith } from '#lib/internal/tools/index.js';
	import { PresenceManager } from '#lib/internal/presence-manager.svelte.js';
	import type { SettleRunner } from '#lib/internal/animations-settled.svelte.js';

	let { open: initialOpen = false, enabled = true, skipExit = false }: { open?: boolean; enabled?: boolean; skipExit?: boolean } = $props();

	let open = $state(initialOpen);
	let completeCount = $state(0);

	// Capture the deferred callbacks so the test fires them on demand — no real animations, so
	// the transition logic is driven deterministically. Mirrors the real runner's contract: the
	// newest run (or a cancel) supersedes everything queued before it, so firing a stale
	// callback is a no-op exactly as it is in production.
	const pending: Array<() => void> = [];
	let token = 0;
	const afterAnimations: SettleRunner = {
		run(_node, fn) {
			const current = ++token;
			pending.push(() => {
				if (current === token) fn();
			});
		},
		cancel() {
			token++;
		},
	};

	// A detached node so the ref box is non-null; never actually read because
	// afterAnimations is injected.
	const node = document.createElement('div');

	const pm = new PresenceManager({
		open: boxWith(() => open),
		ref: boxWith(() => node),
		enabled,
		shouldSkipExitAnimation: skipExit ? () => true : undefined,
		onComplete: () => {
			completeCount += 1;
		},
		afterAnimations,
	});

	export function setOpen(value: boolean) {
		open = value;
	}
	export function pendingCount() {
		return pending.length;
	}
	export function firePending(index = pending.length - 1) {
		pending[index]?.();
	}
</script>

<div data-testid="render">{pm.shouldRender}</div>
<div data-testid="status">{pm.transitionStatus ?? 'none'}</div>
<div data-testid="complete">{completeCount}</div>
