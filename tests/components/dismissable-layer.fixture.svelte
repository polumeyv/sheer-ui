<script lang="ts">
	import { flushSync } from 'svelte';
	import { simpleBox, boxWith, attachRef } from '#lib/internal/tools/index.js';
	import { DismissibleLayerState } from '#lib/internal/dismissible-layer/use-dismissable-layer.svelte.js';
	import { type Timers, type TimerHandle } from '#lib/internal/dismissible-layer/scheduler.js';
	import type { InteractOutsideBehaviorType } from '#lib/internal/dismissible-layer/types.js';

	let {
		withB = false,
		aBehavior = 'close',
		bBehavior = 'close',
	}: {
		withB?: boolean;
		aBehavior?: InteractOutsideBehaviorType;
		bBehavior?: InteractOutsideBehaviorType;
	} = $props();

	let aEnabled = $state(true);
	let bEnabled = $state(true);
	let aCount = $state(0);
	let bCount = $state(0);
	let aLast: PointerEvent | undefined;

	// The injected timer seam: a manual clock. Encapsulated in a factory so its bookkeeping is
	// plain (non-reactive) state rather than component state. `advance(ms)` is the only thing that
	// fires the layer's timers — nothing here touches real time. Mirrors how presence-manager.fixture
	// injects a fake SettleRunner to drive PresenceManager's async window deterministically.
	function createClock() {
		type Scheduled = { id: number; fireAt: number; fn: () => void; delay: number };
		let now = 0;
		let seq = 0;
		let scheduled: Scheduled[] = [];

		const setTimeoutFn = (fn: () => void, ms: number): TimerHandle => {
			const id = ++seq;
			scheduled.push({ id, fireAt: now + ms, fn, delay: ms });
			return id as unknown as TimerHandle;
		};
		const clearTimeoutFn = (handle: TimerHandle | undefined) => {
			if (handle == null) return;
			const id = handle as unknown as number;
			scheduled = scheduled.filter((s) => s.id !== id);
		};
		// The layer's debounce runs over these fake primitives, so the 10ms/20ms windows collapse
		// and cancel identically — only the clock is fake.
		const timers: Timers = { setTimeout: setTimeoutFn, clearTimeout: clearTimeoutFn };

		return {
			timers,
			/** Advance the clock, firing due timers in (fireAt, insertion) order — including any a timer schedules while running. */
			advance(ms: number) {
				const target = now + ms;
				for (;;) {
					let next: Scheduled | undefined;
					for (const s of scheduled) {
						if (s.fireAt <= target && (!next || s.fireAt < next.fireAt || (s.fireAt === next.fireAt && s.id < next.id))) {
							next = s;
						}
					}
					if (!next) break;
					const fired = next;
					scheduled = scheduled.filter((s) => s.id !== fired.id);
					now = fired.fireAt;
					fired.fn();
				}
				now = target;
			},
			/** The `wait` of every still-pending timer — the seam's queue, like presence's pendingCount(). */
			pendingDelays: (): number[] => scheduled.map((s) => s.delay),
		};
	}
	const clock = createClock();

	// Advancing the clock also drains Svelte's microtask queue: `on()` defers pointer/touch listener
	// attachment to a microtask (create_event), and the layer attaches its listeners when the 1ms gate
	// fires. flushSync() runs those deferred attachments, modelling "time passed and the event loop turned".
	export function advance(ms: number) {
		clock.advance(ms);
		flushSync();
	}
	export const pendingDelays = () => clock.pendingDelays();
	export const dismissA = () => aCount;
	export const dismissB = () => bCount;
	export const lastA = () => aLast;
	export function setAEnabled(v: boolean) {
		aEnabled = v;
	}
	export function setBEnabled(v: boolean) {
		bEnabled = v;
	}

	const aRef = simpleBox<HTMLElement | null>(null);
	const aHandler = (e: PointerEvent) => {
		aCount += 1;
		aLast = e;
	};
	DismissibleLayerState.create({
		id: boxWith(() => 'a'),
		interactOutsideBehavior: boxWith(() => aBehavior),
		onInteractOutside: boxWith(() => aHandler),
		enabled: boxWith(() => aEnabled),
		ref: aRef,
		timers: clock.timers,
	});

	const bRef = simpleBox<HTMLElement | null>(null);
	const bHandler = () => {
		bCount += 1;
	};
	DismissibleLayerState.create({
		id: boxWith(() => 'b'),
		interactOutsideBehavior: boxWith(() => bBehavior),
		onInteractOutside: boxWith(() => bHandler),
		enabled: boxWith(() => bEnabled),
		ref: bRef,
		timers: clock.timers,
	});
</script>

<div data-testid="outside"></div>
<div data-testid="layer-a" {...attachRef(aRef)}>
	<div data-testid="inside-a"></div>
</div>
{#if withB}
	<div data-testid="layer-b" {...attachRef(bRef)}>
		<div data-testid="inside-b"></div>
	</div>
{/if}
