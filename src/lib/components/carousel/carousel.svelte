<script lang="ts">
	import { type CarouselAPI, type CarouselContext, type CarouselProps, setEmblaContext } from './carouselState.svelte';
	import { cn, type WithElementRef } from '../../vendor/utils';

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
	let scrollSnaps = $state.raw<number[]>([]);
	let selectedIndex = $state(0);
	let targetIndex = $state(0);

	const isLoop = $derived(opts.loop === true);
	const lastIndex = $derived(scrollSnaps.length - 1);

	const canScrollPrev = $derived(scrollSnaps.length > 1 && (isLoop || targetIndex > 0));

	const canScrollNext = $derived(scrollSnaps.length > 1 && (isLoop || targetIndex < lastIndex));

	function clamp(index: number) {
		return Math.min(Math.max(index, 0), lastIndex);
	}

	function wrap(index: number) {
		return ((index % scrollSnaps.length) + scrollSnaps.length) % scrollSnaps.length;
	}

	function resolveIndex(index: number) {
		if (scrollSnaps.length === 0) return 0;
		return isLoop ? wrap(index) : clamp(index);
	}

	function syncState() {
		if (!api) return;

		scrollSnaps = api.snapList();
		selectedIndex = api.selectedSnap();
		targetIndex = selectedIndex;
	}

	function registerApi(nextApi: CarouselAPI | undefined) {
		if (api === nextApi) return;

		if (api) {
			api.off('select', syncState);
			api.off('reinit', syncState);
		}

		api = nextApi;
		setApi(api);

		if (!api) return;

		api.on('select', syncState);
		api.on('reinit', syncState);

		syncState();
	}

	function scrollBy(direction: -1 | 1) {
		if (!api || scrollSnaps.length === 0) return;

		const nextIndex = resolveIndex(targetIndex + direction);

		if (!isLoop && nextIndex === targetIndex) return;

		targetIndex = nextIndex;

		api.goTo(targetIndex, false, direction > 0 ? 'forward' : 'backward');
	}

	function scrollPrev() {
		scrollBy(-1);
	}

	function scrollNext() {
		scrollBy(1);
	}

	function scrollTo(index: number, instant?: boolean) {
		if (!api || scrollSnaps.length === 0) return;

		targetIndex = resolveIndex(index);
		api.goTo(targetIndex, instant);
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

	const emblaCtx: CarouselContext = {
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
	};

	setEmblaContext(emblaCtx);

	$effect(() => {
		return () => registerApi(undefined);
	});
</script>

<div
	bind:this={ref}
	data-slot="carousel"
	class={cn('relative', className)}
	role="region"
	aria-roledescription="carousel"
	onkeydown={handleKeyDown}
	{...restProps}>
	{@render children?.()}
</div>
