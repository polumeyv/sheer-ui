<script lang="ts" module>
	// Default lifetime of a toasts (in ms)
	const TOAST_LIFETIME = 4000;

	// Default gap between toasts
	const GAP = 14;

	// Threshold to dismiss a toast
	const SWIPE_THRESHOLD = 45;

	// Equal to exit animation duration
	const TIME_BEFORE_UNMOUNT = 200;

	const SCALE_MULTIPLIER = 0.05;

	const DEFAULT_TOAST_CLASSES: ToastClasses = {
		toast: '',
		title: '',
		description: '',
		loader: '',
		closeButton: '',
		cancelButton: '',
		actionButton: '',
		action: '',
		warning: '',
		error: '',
		success: '',
		default: '',
		info: '',
		loading: '',
	};

	// Shared by the action/cancel buttons. Deliberately carries no bg-*/text-* utility —
	// each button supplies its own so cn() (plain join, no conflict resolution) never has
	// to arbitrate between two colors for the same property.
	const BUTTON_BASE_CLASS =
		'ms-auto flex h-6 shrink-0 cursor-pointer items-center rounded border-0 px-2 text-xs font-medium outline-none [transition:opacity_400ms,box-shadow_200ms] focus-visible:shadow-[0_0_0_2px_rgba(0,0,0,0.4)]';

	function getDefaultSwipeDirections(position: string): Array<SwipeDirection> {
		const [y, x] = position.split('-');
		const directions: Array<SwipeDirection> = [];

		if (y) {
			directions.push(y as SwipeDirection);
		}

		if (x) {
			directions.push(x as SwipeDirection);
		}

		return directions;
	}

	function getDampening(delta: number) {
		const factor = Math.abs(delta) / 20;

		return 1 / (1.5 + factor);
	}
</script>

<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { isAction, type SwipeDirection, type ToastClasses, type ToastProps } from './types.js';
	import { toastState } from './toast-state.svelte.js';
	import { cn } from '$lib/utils.js';
	import type { DragEventHandler, PointerEventHandler } from 'svelte/elements';
	import { on } from 'svelte/events';
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
	import InfoIcon from '@lucide/svelte/icons/info';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import OctagonXIcon from '@lucide/svelte/icons/octagon-x';
	import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';
	import XIcon from '@lucide/svelte/icons/x';

	let {
		toast,
		index,
		expanded,
		invert: invertFromToaster,
		position,
		visibleToasts,
		expandByDefault,
		closeButton: closeButtonFromToaster,
		interacting,
		cancelButtonStyle = '',
		actionButtonStyle = '',
		duration: durationFromToaster,
		descriptionClass = '',
		classes: classesProp,
		unstyled = false,
		defaultRichColors = false,
		swipeDirections: swipeDirectionsProp,
		closeButtonAriaLabel,
		pauseWhenPageIsHidden,
		...restProps
	}: ToastProps = $props();

	const styled = $derived(!(toast.component || toast.unstyled || unstyled));
	const toastType = $derived(toast.type);
	const toastClass = $derived(toast.class || '');
	const classes = $derived({ ...DEFAULT_TOAST_CLASSES, ...classesProp });

	const toastRootClass = $derived(
		cn(
			'absolute box-border touch-none [overflow-wrap:anywhere] opacity-0 outline-none',
			'z-[var(--z-index)] [transform:var(--y)]',
			'transition-[transform,opacity,height,box-shadow] duration-[400ms]',
			// opacity stays here (it cascades correctly); the --y entrance/settled/stacking
			// transform cascade lives in Toaster.svelte's :global block — see the note there.
			'data-[mounted=true]:opacity-100',
			'data-[visible=false]:pointer-events-none data-[visible=false]:opacity-0',
			'data-[swiped=true]:select-none',
			'data-[swiping=true]:[transform:var(--y)_translateY(var(--swipe-amount-y,0px))_translateX(var(--swipe-amount-x,0px))]',
			'data-[swiping=true]:transition-none',
			'data-[x-position=left]:left-0 data-[x-position=right]:right-0',
			// !-forced: ties data-[styled=true]:w-[var(--width)] on specificity (both class+attribute),
			// and without !important this loses the tie to Tailwind's own internal utility ordering.
			'max-[600px]:inset-x-0! max-[600px]:w-[calc(100%-var(--mobile-offset-left)*2)]!',
			'data-[styled=true]:flex data-[styled=true]:w-[var(--width)] data-[styled=true]:items-center data-[styled=true]:gap-1.5',
			'data-[styled=true]:rounded-[var(--border-radius)] data-[styled=true]:border data-[styled=true]:border-[color:var(--normal-border)]',
			'data-[styled=true]:bg-[var(--normal-bg)] data-[styled=true]:p-4 data-[styled=true]:text-[13px] data-[styled=true]:text-[color:var(--normal-text)]',
			'data-[styled=true]:shadow-[0px_4px_12px_rgba(0,0,0,0.1)]',
			'focus-visible:shadow-[0px_4px_12px_rgba(0,0,0,0.1),0_0_0_2px_rgba(0,0,0,0.2)]',
			restProps.class,
			toastClass,
			classes?.toast,
			toast?.classes?.toast,
			classes?.[toastType],
			toast?.classes?.[toastType],
		),
	);

	// Fades the icon in when it's swapped mid-flight (loading -> success/error) during a toast.promise() sequence.
	const iconClass = $derived(cn('size-4 shrink-0 ms-[-1px]', toast.promise && '[animation:sonner-fade-in_300ms_ease_forwards]'));

	let mounted = $state(false);
	let removed = $state(false);
	let swiping = $state(false);
	let swipeOut = $state(false);
	let isSwiped = $state(false);
	let offsetBeforeRemove = $state(0);
	let initialHeight = $state(0);
	let remainingTime = 0;
	let dragStartTime = $state<Date | null>(null);
	let toastRef = $state<HTMLLIElement>();
	let swipeDirection = $state<'x' | 'y' | null>(null);
	let swipeOutDirection = $state<'left' | 'right' | 'up' | 'down' | null>(null);
	const isFront = $derived(index === 0);
	const isVisible = $derived(index + 1 <= visibleToasts);
	const dismissible = $derived(toast.dismissible !== undefined ? toast.dismissible !== false : toast.dismissable !== false);
	const toastDescriptionClass = $derived(toast.descriptionClass || '');
	// height index is used to calculate the offset as it gets updated before the toast array, which means we can calculate the new layout faster.
	const heightIndex = $derived(toastState.heights.findIndex((height) => height.toastId === toast.id) || 0);
	const closeButton = $derived(toast.closeButton ?? closeButtonFromToaster);
	const duration = $derived(toast.duration ?? durationFromToaster ?? TOAST_LIFETIME);
	let pointerStart: { x: number; y: number } | null = null;
	const coords = $derived(position.split('-'));
	const toastsHeightBefore = $derived(
		toastState.heights.reduce((prev, curr, reducerIndex) => {
			if (reducerIndex >= heightIndex) return prev;
			return prev + curr.height;
		}, 0),
	);
	let isDocumentHidden = $state(false);

	$effect(() => {
		if (!pauseWhenPageIsHidden) return;

		const syncDocumentHidden = () => {
			isDocumentHidden = document.hidden;
		};

		syncDocumentHidden();

		return on(document, 'visibilitychange', syncDocumentHidden);
	});

	const invert = $derived(toast.invert || invertFromToaster);
	const disabled = $derived(toastType === 'loading');

	const toastTitle = $derived(toast.title);
	const toastDescription = $derived(toast.description);

	let closeTimerStartTime = $state(0);
	let lastCloseTimerStartTime = $state(0);

	const offset = $derived(Math.round(heightIndex * GAP + toastsHeightBefore));

	$effect(() => {
		toastTitle;
		toastDescription;
		let scale: number;

		if (expanded || expandByDefault) {
			scale = 1;
		} else {
			scale = 1 - index * SCALE_MULTIPLIER;
		}

		const toastEl = untrack(() => toastRef);
		if (toastEl === undefined) return;
		toastEl.style.setProperty('height', 'auto');

		const offsetHeight = toastEl.offsetHeight;
		const rectHeight = toastEl.getBoundingClientRect().height;
		const scaledRectHeight = Math.round((rectHeight / scale + Number.EPSILON) & 100) / 100;

		toastEl.style.removeProperty('height');

		let finalHeight: number;

		if (Math.abs(scaledRectHeight - offsetHeight) < 1) {
			// use scaledRectHeight as it's more precise
			finalHeight = scaledRectHeight;
		} else {
			// toast was transitioning its scale, so scaledRectHeight isn't accurate
			finalHeight = offsetHeight;
		}

		initialHeight = finalHeight;

		toastState.setHeight({ toastId: toast.id, height: finalHeight });
	});

	function deleteToast() {
		removed = true;
		// save the offset for the exit swipe animation
		offsetBeforeRemove = offset;

		toastState.removeHeight(toast.id);

		setTimeout(() => {
			toastState.remove(toast.id);
		}, TIME_BEFORE_UNMOUNT);
	}

	let timeoutId: ReturnType<typeof setTimeout>;

	const isPromiseLoadingOrInfiniteDuration = $derived(
		(toast.promise && toastType === 'loading') || toast.duration === Number.POSITIVE_INFINITY,
	);

	function startTimer() {
		closeTimerStartTime = new Date().getTime();
		const timeout = remainingTime || duration;
		// let the toast know it has started
		timeoutId = setTimeout(() => {
			toast.onAutoClose?.(toast);
			deleteToast();
		}, timeout);
	}

	function pauseTimer() {
		if (lastCloseTimerStartTime < closeTimerStartTime) {
			// get the elapsed time since the timer started
			const elapsedTime = new Date().getTime() - closeTimerStartTime;
			remainingTime = (remainingTime || duration) - elapsedTime;
		}

		lastCloseTimerStartTime = new Date().getTime();
	}

	$effect(() => {
		if (toast.updated) {
			// if the toast has been updated after the initial render,
			// we want to reset the timer and set the remaining time to the
			// new duration
			clearTimeout(timeoutId);
			remainingTime = duration;
			if (!isPromiseLoadingOrInfiniteDuration) {
				startTimer();
			}
		}
	});

	$effect(() => {
		if (!isPromiseLoadingOrInfiniteDuration) {
			if (expanded || interacting || (pauseWhenPageIsHidden && isDocumentHidden)) {
				pauseTimer();
			} else {
				startTimer();
			}
		}

		return () => clearTimeout(timeoutId);
	});

	onMount(() => {
		mounted = true;

		const height = toastRef?.getBoundingClientRect().height as number;

		initialHeight = height;
		toastState.setHeight({ toastId: toast.id, height });

		return () => {
			toastState.removeHeight(toast.id);
		};
	});

	$effect(() => {
		if (toast.delete) {
			untrack(() => {
				deleteToast();
				toast.onDismiss?.(toast);
			});
		}
	});

	const handlePointerDown: PointerEventHandler<HTMLLIElement> = (event) => {
		if (disabled) return;

		offsetBeforeRemove = offset;
		const target = event.target as HTMLElement;

		// ensure we maintain correct pointer capture even when going outside of the toast (e.g. when swiping)
		target.setPointerCapture(event.pointerId);
		if (target.tagName === 'BUTTON') return;
		swiping = true;
		pointerStart = { x: event.clientX, y: event.clientY };
	};

	const handlePointerUp: PointerEventHandler<HTMLLIElement> = () => {
		if (swipeOut || !dismissible) return;

		pointerStart = null;
		const swipeAmountX = Number(toastRef?.style.getPropertyValue('--swipe-amount-x').replace('px', '') || 0);
		const swipeAmountY = Number(toastRef?.style.getPropertyValue('--swipe-amount-y').replace('px', '') || 0);
		const timeTaken = new Date().getTime() - (dragStartTime?.getTime() ?? 0);

		const swipeAmount = swipeDirection === 'x' ? swipeAmountX : swipeAmountY;
		const velocity = Math.abs(swipeAmount) / timeTaken;

		// remove only if threshold is met
		if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > 0.11) {
			offsetBeforeRemove = offset;
			toast.onDismiss?.(toast);

			if (swipeDirection === 'x') {
				swipeOutDirection = swipeAmountX > 0 ? 'right' : 'left';
			} else {
				swipeOutDirection = swipeAmountY > 0 ? 'down' : 'up';
			}

			deleteToast();
			swipeOut = true;
			return;
		} else {
			toastRef?.style.setProperty('--swipe-amount-x', '0px');
			toastRef?.style.setProperty('--swipe-amount-y', '0px');
		}
		isSwiped = false;
		swiping = false;
		swipeDirection = null;
	};

	const handlePointerMove: PointerEventHandler<HTMLLIElement> = (event) => {
		if (!pointerStart || !dismissible) return;

		const isHighlighted = (window.getSelection()?.toString().length ?? -1) > 0;
		if (isHighlighted) return;

		const yDelta = event.clientY - pointerStart.y;
		const xDelta = event.clientX - pointerStart.x;

		const swipeDirections = swipeDirectionsProp ?? getDefaultSwipeDirections(position);

		// Determine swipe direction if not already locked
		if (!swipeDirection && (Math.abs(xDelta) > 1 || Math.abs(yDelta) > 1)) {
			swipeDirection = Math.abs(xDelta) > Math.abs(yDelta) ? 'x' : 'y';
		}

		let swipeAmount = { x: 0, y: 0 };

		if (swipeDirection === 'y') {
			// handle vertical swipes
			if (swipeDirections.includes('top') || swipeDirections.includes('bottom')) {
				if ((swipeDirections.includes('top') && yDelta < 0) || (swipeDirections.includes('bottom') && yDelta > 0)) {
					swipeAmount.y = yDelta;
				} else {
					// smoothly transition to dampened movement
					const dampenedDelta = yDelta * getDampening(yDelta);
					// ensure we don't jump when transition to dampened movement
					swipeAmount.y = Math.abs(dampenedDelta) < Math.abs(yDelta) ? dampenedDelta : yDelta;
				}
			}
		} else if (swipeDirection === 'x') {
			// handle horizontal swipes
			if (swipeDirections.includes('left') || swipeDirections.includes('right')) {
				if ((swipeDirections.includes('left') && xDelta < 0) || (swipeDirections.includes('right') && xDelta > 0)) {
					swipeAmount.x = xDelta;
				} else {
					// Smoothly transition to dampened movement
					const dampenedDelta = xDelta * getDampening(xDelta);
					// Ensure we don't jump when transitioning to dampened movement
					swipeAmount.x = Math.abs(dampenedDelta) < Math.abs(xDelta) ? dampenedDelta : xDelta;
				}
			}
		}

		if (Math.abs(swipeAmount.x) > 0 || Math.abs(swipeAmount.y) > 0) {
			isSwiped = true;
		}

		toastRef?.style.setProperty('--swipe-amount-x', `${swipeAmount.x}px`);
		toastRef?.style.setProperty('--swipe-amount-y', `${swipeAmount.y}px`);
	};

	const handleDragEnd: DragEventHandler<HTMLLIElement> = () => {
		swiping = false;
		swipeDirection = null;
		pointerStart = null;
	};
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<li
	tabindex={0}
	bind:this={toastRef}
	class={toastRootClass}
	aria-live={toast.important ? 'assertive' : 'polite'}
	aria-atomic="true"
	data-sonner-toast=""
	data-rich-colors={toast.richColors ?? defaultRichColors}
	data-styled={styled}
	data-mounted={mounted}
	data-promise={Boolean(toast.promise)}
	data-swiped={isSwiped}
	data-removed={removed}
	data-visible={isVisible}
	data-y-position={coords[0]}
	data-x-position={coords[1]}
	data-index={index}
	data-front={isFront}
	data-swiping={swiping}
	data-dismissible={dismissible}
	data-type={toastType}
	data-invert={invert}
	data-swipe-out={swipeOut}
	data-swipe-direction={swipeOutDirection}
	data-expanded={Boolean(expanded || (expandByDefault && mounted))}
	style:--index={index}
	style:--toasts-before={index}
	style:--z-index={toastState.toasts.length - index}
	style:--offset={`${removed ? offsetBeforeRemove : offset}px`}
	style:--initial-height={expandByDefault ? 'auto' : `${initialHeight}px`}
	style={`${restProps.style} ${toast.style}`}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	onpointerdown={handlePointerDown}
	ondragend={handleDragEnd}>
	{#if closeButton && !toast.component && toastType !== 'loading'}
		<button
			aria-label={closeButtonAriaLabel}
			data-disabled={disabled}
			data-close-button
			onclick={() => {
				if (disabled || !dismissible) return;
				deleteToast();
				toast.onDismiss?.(toast);
			}}
			class={cn(
				'absolute start-0 top-0 z-[1] flex size-5 items-center justify-center rounded-full border p-0 outline-none',
				'cursor-pointer border-[hsl(0,0%,93%)] bg-(--normal-bg) text-[hsl(0,0%,9%)]',
				'[transform:translate(-35%,-35%)] rtl:[transform:translate(35%,-35%)]',
				'[transition:opacity_100ms,background_200ms,border-color_200ms]',
				'hover:border-[hsl(0,0%,90.9%)] hover:bg-[hsl(0,0%,97.3%)]',
				'focus-visible:shadow-[0px_4px_12px_rgba(0,0,0,0.1),0_0_0_2px_rgba(0,0,0,0.2)]',
				'data-[disabled=true]:cursor-not-allowed',
				classes?.closeButton,
				toast?.classes?.closeButton,
			)}>
			<XIcon class="size-3" />
		</button>
	{/if}

	{#if toast.component}
		{@const Component = toast.component}
		<Component {...toast.componentProps} closeToast={deleteToast} />
	{:else}
		{#if toastType === 'loading' || toastType === 'success' || toastType === 'error' || toastType === 'warning' || toastType === 'info'}
			<div
				data-icon=""
				class={cn('relative flex size-4 shrink-0 items-center justify-start ms-[-3px] me-1', classes?.icon, toast?.classes?.icon)}>
				{#if toastType === 'loading'}
					<Loader2Icon class={cn(iconClass, 'animate-spin')} />
				{:else if toastType === 'success'}
					<CircleCheckIcon class={iconClass} strokeWidth={2.5} />
				{:else if toastType === 'error'}
					<OctagonXIcon class={iconClass} strokeWidth={2.5} />
				{:else if toastType === 'warning'}
					<TriangleAlertIcon class={iconClass} strokeWidth={2.5} />
				{:else if toastType === 'info'}
					<InfoIcon class={iconClass} strokeWidth={2.5} />
				{/if}
			</div>
		{/if}
		<div data-content="" class={cn('flex flex-col gap-0.5', classes?.content, toast?.classes?.content)}>
			<div data-title="" class={cn('font-medium leading-normal', classes?.title, toast?.classes?.title)}>
				{#if toast.title}
					{#if typeof toast.title !== 'string'}
						{@const Title = toast.title}
						<Title {...toast.componentProps} />
					{:else}
						{toast.title}
					{/if}
				{/if}
			</div>
			{#if toast.description}
				<div
					data-description=""
					class={cn(
						'font-normal leading-[1.4] text-[#3f3f3f]',
						descriptionClass,
						toastDescriptionClass,
						classes?.description,
						toast.classes?.description,
					)}>
					{#if typeof toast.description !== 'string'}
						{@const Description = toast.description}
						<Description {...toast.componentProps} />
					{:else}
						{toast.description}
					{/if}
				</div>
			{/if}
		</div>
		{#if toast.cancel}
			{#if typeof toast.cancel === 'function'}
				<toast.cancel />
			{:else if isAction(toast.cancel)}
				<button
					data-button
					data-cancel
					style={toast.cancelButtonStyle ?? cancelButtonStyle}
					class={cn(BUTTON_BASE_CLASS, 'bg-black/8 text-(--normal-text)', classes?.cancelButton, toast?.classes?.cancelButton)}
					onclick={(event) => {
						if (!isAction(toast.cancel)) return;
						if (!dismissible) return;
						toast.cancel?.onClick?.(event);
						deleteToast();
					}}>
					{toast.cancel.label}
				</button>
			{/if}
		{/if}
		{#if toast.action}
			{#if typeof toast.action === 'function'}
				<toast.action />
			{:else if isAction(toast.action)}
				<button
					data-button=""
					style={toast.actionButtonStyle ?? actionButtonStyle}
					class={cn(BUTTON_BASE_CLASS, 'bg-(--normal-text) text-(--normal-bg)', classes?.actionButton, toast?.classes?.actionButton)}
					onclick={(event) => {
						if (!isAction(toast.action)) return;
						toast.action?.onClick(event);
						if (event.defaultPrevented) return;
						deleteToast();
					}}>
					{toast.action.label}
				</button>
			{/if}
		{/if}
	{/if}
</li>
