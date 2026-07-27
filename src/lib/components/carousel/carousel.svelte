<script lang="ts">
	import { join } from 'overrule';
	import { untrack } from 'svelte';
	import { on } from 'svelte/events';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Attachment } from 'svelte/attachments';
	import type { WithElementRef } from '../../internal/utils.js';
	import { setCarouselContext, setCarouselWiring, type CarouselAlign, type CarouselOrientation } from './carouselState.svelte';

	let {
		ref = $bindable(null),
		orientation = 'horizontal',
		align = 'start',
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		orientation?: CarouselOrientation;
		align?: CarouselAlign;
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

		snapOffsets = [...el.children].map((slide) => {
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

		return snapOffsets;
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
		atStart = Math.abs(pos) <= 1;
		atEnd = Math.abs(pos) >= scrollSize(scroller) - viewSize(scroller) - 1;
	}

	function scrollToIndex(index: number, behavior: ScrollBehavior = 'smooth') {
		if (!scroller) return;

		const offsets = measureOffsets(scroller);
		if (!offsets.length) return;

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
		let timer: ReturnType<typeof setTimeout>;
		const off = on(node, 'scroll', () => {
			clearTimeout(timer);
			timer = setTimeout(sync, 150);
		}, { passive: true });

		return () => {
			clearTimeout(timer);
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
