<script lang="ts">
	import { join } from 'overrule';
	import { untrack } from 'svelte';
	import { on } from 'svelte/events';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Attachment } from 'svelte/attachments';
	import type { WithElementRef } from '../../internal/utils.js';
	import { createEffectTimeout } from '../../internal/timeout-fn.svelte.js';
	import { setCarouselContext, setCarouselWiring, type CarouselAlign, type CarouselOrientation } from './carouselState.svelte';

	let {
		ref = $bindable(null),
		orientation = 'horizontal',
		align = 'start',
		loop = false,
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		orientation?: CarouselOrientation;
		align?: CarouselAlign;
		/** Endless scrolling via flex-`order` rotation: the selected slide is re-centered in the
		 *  strip on every scrollend, so there is always runway on both sides. Needs ≥3 slides. */
		loop?: boolean;
	} = $props();

	let scroller = $state.raw<HTMLElement | null>(null);

	// Scroll facts, synced from the native scroller on scrollend. Selection is a
	// scroll fact here, not an engine event: the browser owns physics and snapping.
	let selectedIndex = $state(0);
	let snapOffsets = $state.raw<number[]>([]);
	let atStart = $state(true);
	let atEnd = $state(true);

	const horizontal = $derived(orientation === 'horizontal');

	const scrollPos = (el: HTMLElement) => (horizontal ? el.scrollLeft : el.scrollTop);
	const viewSize = (el: HTMLElement) => (horizontal ? el.clientWidth : el.clientHeight);
	const scrollSize = (el: HTMLElement) => (horizontal ? el.scrollWidth : el.scrollHeight);

	// Snap offset of a slide in scroll coordinates for the configured alignment.
	// Rect deltas against the current scroll position stay correct under RTL, where
	// scrollLeft runs negative — but the logical inline-start edge is the RIGHT edge
	// there, so both the measured edge and the align offset's sign must flip or
	// `align: center/end` disagrees with where scroll-snap-align actually snaps.
	function measureOffsets(el: HTMLElement): number[] {
		const scrollerRect = el.getBoundingClientRect();
		const pos = scrollPos(el);
		const rtl = horizontal && getComputedStyle(el).direction === 'rtl';

		const measured = [...el.children].map((slide) => {
			const slideRect = slide.getBoundingClientRect();
			const start =
				horizontal ?
					rtl ? slideRect.right - scrollerRect.right
					:	slideRect.left - scrollerRect.left
				:	slideRect.top - scrollerRect.top;
			const size = horizontal ? slideRect.width : slideRect.height;
			const free = viewSize(el) - size;
			const alignOffset = align === 'center' ? free / 2 : align === 'end' ? free : 0;

			return pos + start + (rtl ? alignOffset : -alignOffset);
		});

		// publish only on change — most measurements confirm the same offsets, and every
		// reassignment invalidates the dot UIs reading `scrollSnaps`
		if (measured.length !== snapOffsets.length || measured.some((v, i) => v !== snapOffsets[i])) snapOffsets = measured;

		return measured;
	}

	// Rotate CSS `order` so the selected slide sits mid-strip, then scroll STRAIGHT TO its
	// post-rotation snap offset — absolute, not a relative delta. The browser reacts to the
	// reorder on its own (snap-follow, scroll anchoring); a relative compensation stacks on top
	// of that and oscillates one stride per scrollend, while the absolute target is a fixed
	// point no matter who scrolls first. DOM order never changes: indices, offsets, and dot
	// UIs keep speaking child order.
	function recenter() {
		if (!scroller) return;
		const slides = [...scroller.children] as HTMLElement[];
		const n = slides.length;
		if (n < 3) return;

		const half = Math.floor(n / 2);
		for (let i = 0; i < n; i++) {
			slides[i]!.style.order = String((((i - selectedIndex + half) % n) + n) % n);
		}
		const offset = measureOffsets(scroller)[selectedIndex]!;
		if (Math.abs(scrollPos(scroller) - offset) >= 1) {
			scroller.scrollTo(horizontal ? { left: offset, behavior: 'instant' } : { top: offset, behavior: 'instant' });
		}
	}

	function sync() {
		if (!scroller) return;

		const offsets = measureOffsets(scroller);
		const pos = scrollPos(scroller);

		let closest = 0;
		for (let i = 1; i < offsets.length; i++) {
			if (Math.abs(offsets[i]! - pos) < Math.abs(offsets[closest]! - pos)) closest = i;
		}

		selectedIndex = closest;
		if (loop) {
			atStart = false;
			atEnd = false;
			recenter();
			return;
		}
		atStart = Math.abs(pos) <= 1;
		atEnd = Math.abs(pos) >= scrollSize(scroller) - viewSize(scroller) - 1;
	}

	function scrollToIndex(index: number, behavior: ScrollBehavior = 'smooth') {
		if (!scroller) return;

		const offsets = measureOffsets(scroller);
		if (!offsets.length) return;

		if (loop) {
			// Wrap instead of clamp. Rapid clicks past the wrap point animate across the strip once
			// (recenter hasn't run between clicks) — settles correctly on scrollend.
			const target = ((index % offsets.length) + offsets.length) % offsets.length;
			selectedIndex = target;
			scroller.scrollTo(horizontal ? { left: offsets[target], behavior } : { top: offsets[target], behavior });
			return;
		}

		const clamped = Math.min(Math.max(index, 0), offsets.length - 1);

		// Optimistic, so rapid clicks queue from the pending target and the
		// arrows disable without waiting for scrollend.
		selectedIndex = clamped;
		atStart = Math.abs(offsets[clamped]!) <= 1;
		atEnd = Math.abs(offsets[clamped]!) >= scrollSize(scroller) - viewSize(scroller) - 1;

		scroller.scrollTo(horizontal ? { left: offsets[clamped], behavior } : { top: offsets[clamped], behavior });
	}

	function scrollPrev() {
		scrollToIndex(selectedIndex - 1);
	}

	function scrollNext() {
		scrollToIndex(selectedIndex + 1);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (orientation === 'horizontal') {
			if (event.key === 'ArrowLeft') {
				event.preventDefault();
				scrollPrev();
			}

			if (event.key === 'ArrowRight') {
				event.preventDefault();
				scrollNext();
			}

			return;
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault();
			scrollPrev();
		}

		if (event.key === 'ArrowDown') {
			event.preventDefault();
			scrollNext();
		}
	}

	const scrollerAttachment: Attachment<HTMLElement> = (node) => {
		scroller = node;
		// untrack: sync reads the scroller/index state this attachment writes; tracking
		// it would make the attachment re-run on its own writes.
		untrack(sync);

		// scrollend is Baseline; the debounced scroll fallback covers older Safari.
		const dispose = 'onscrollend' in window ? on(node, 'scrollend', sync) : debouncedScrollFallback(node);

		return () => {
			dispose();
			scroller = null;
		};
	};

	function debouncedScrollFallback(node: HTMLElement) {
		const debouncedSync = createEffectTimeout(sync, () => 150);
		const off = on(node, 'scroll', debouncedSync.start, { passive: true });

		return () => {
			debouncedSync.stop();
			off();
		};
	}

	setCarouselWiring({
		get orientation() {
			return orientation;
		},
		get align() {
			return align;
		},
		scroller: scrollerAttachment,
	});

	// The consumer-facing context: arrows and dot UIs read scroll facts from here.
	setCarouselContext({
		get orientation() {
			return orientation;
		},
		get canScrollNext() {
			return !atEnd;
		},
		get canScrollPrev() {
			return !atStart;
		},
		get scrollSnaps() {
			return snapOffsets;
		},
		get selectedIndex() {
			return selectedIndex;
		},
		scrollPrev,
		scrollNext,
		scrollTo: (index: number, jump?: boolean) => scrollToIndex(index, jump ? 'instant' : 'smooth'),
		handleKeyDown,
	});
</script>

<div
	bind:this={ref}
	data-slot="carousel"
	class={join('relative', className)}
	role="region"
	aria-roledescription="carousel"
	onkeydown={handleKeyDown}
	{...restProps}>
	{@render children?.()}
</div>
