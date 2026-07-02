<script lang="ts">
	import { join } from 'overrule';
	import { type CarouselAPI, type CarouselProps, setCarouselContext } from './carouselState.svelte';
	import type { WithElementRef } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		opts = {},
		plugins = [],
		setApi = () => {},
		orientation = 'horizontal',
		class: className,
		children,
		...restProps
	}: WithElementRef<CarouselProps> = $props();

	let api = $state.raw<CarouselAPI | undefined>(undefined);

	// The engine's index counter and engine reference are reactive state, so these
	// read live engine values; no event subscriptions or mirrored state needed.
	const scrollSnaps = $derived(api?.snapList() ?? []);
	const selectedIndex = $derived(api?.selectedSnap() ?? 0);
	const canScrollPrev = $derived(api?.canGoToPrev() ?? false);
	const canScrollNext = $derived(api?.canGoToNext() ?? false);

	const registerApi = (nextApi: CarouselAPI | undefined) => {
		if (api === nextApi) return;

		api = nextApi;
		setApi(api);
	};

	const scrollPrev = () => {
		api?.goToPrev();
	};

	const scrollNext = () => {
		api?.goToNext();
	};

	const scrollTo = (index: number, instant?: boolean) => {
		api?.goTo(index, instant);
	};

	const handleKeyDown = (event: KeyboardEvent) => {
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
	};

	setCarouselContext({
		get api() {
			return api;
		},
		get orientation() {
			return orientation;
		},
		get options() {
			return opts;
		},
		get plugins() {
			return plugins;
		},
		get canScrollNext() {
			return canScrollNext;
		},
		get canScrollPrev() {
			return canScrollPrev;
		},
		get scrollSnaps() {
			return scrollSnaps;
		},
		get selectedIndex() {
			return selectedIndex;
		},
		registerApi,
		scrollPrev,
		scrollNext,
		scrollTo,
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
