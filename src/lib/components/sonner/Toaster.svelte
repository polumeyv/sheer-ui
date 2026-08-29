<script lang="ts" module>
	// visible toasts amount
	const VISIBLE_TOASTS_AMOUNT = 3;

	// Viewport padding
	const VIEWPORT_OFFSET = '24px';

	// Mobile viewport padding
	const MOBILE_VIEWPORT_OFFSET = '16px';

	// Default lifetime of a toasts (in ms)
	const TOAST_LIFETIME = 4000;

	// Default toast width
	const TOAST_WIDTH = 356;

	// Default gap between toasts
	const GAP = 14;

	const DARK = 'dark';
	const LIGHT = 'light';

	type OffsetObject = {
		'--offset-top': string;
		'--offset-right': string;
		'--offset-bottom': string;
		'--offset-left': string;
		'--mobile-offset-top': string;
		'--mobile-offset-right': string;
		'--mobile-offset-bottom': string;
		'--mobile-offset-left': string;
	};

	function getOffsetObject(defaultOffset: ToasterProps['offset'], mobileOffset: ToasterProps['mobileOffset']) {
		const styles = {} as OffsetObject;

		[defaultOffset, mobileOffset].forEach((offset, index) => {
			const isMobile = index === 1;
			const prefix = isMobile ? '--mobile-offset' : '--offset';
			const defaultValue = isMobile ? MOBILE_VIEWPORT_OFFSET : VIEWPORT_OFFSET;

			function assignAll(offset: string | number) {
				['top', 'right', 'bottom', 'left'].forEach((key) => {
					styles[`${prefix}-${key}` as keyof OffsetObject] = typeof offset === 'number' ? `${offset}px` : offset;
				});
			}

			if (typeof offset === 'number' || typeof offset === 'string') {
				assignAll(offset);
			} else if (typeof offset === 'object') {
				['top', 'right', 'bottom', 'left'].forEach((key) => {
					const value = offset[key as keyof typeof offset];
					if (value === undefined) {
						styles[`${prefix}-${key}` as keyof OffsetObject] = defaultValue;
					} else {
						styles[`${prefix}-${key}` as keyof OffsetObject] = typeof value === 'number' ? `${value}px` : value;
					}
				});
			} else {
				assignAll(defaultValue);
			}
		});

		return styles;
	}
</script>

<script lang="ts">
	import { join } from 'overrule';
	import { getTheme } from '../theme-toggle/index.js';
	import { onMount, untrack } from 'svelte';
	import { toastState } from './toast-state.svelte.js';
	import Toast from './Toast.svelte';
	import type { ToasterProps } from './types.js';
	import type { Position } from './types.js';
	import type { DragEventHandler, FocusEventHandler, MouseEventHandler, PointerEventHandler } from 'svelte/elements';
	import { on } from 'svelte/events';
	import { MediaQuery } from 'svelte/reactivity';

	let {
		invert = false,
		position = 'bottom-right',
		hotkey = ['altKey', 'KeyT'],
		expand = false,
		closeButton = false,
		offset = VIEWPORT_OFFSET,
		mobileOffset = MOBILE_VIEWPORT_OFFSET,
		theme: themeProp,
		richColors = false,
		duration = TOAST_LIFETIME,
		visibleToasts = VISIBLE_TOASTS_AMOUNT,
		toastOptions = {},
		dir = 'auto',
		gap = GAP,
		pauseWhenPageIsHidden = false,
		containerAriaLabel = 'Notifications',
		class: className,
		closeButtonAriaLabel = 'Close toast',
		onblur,
		onfocus,
		onmouseenter,
		onmousemove,
		onmouseleave,
		ondragend,
		onpointerdown,
		onpointerup,
		...restProps
	}: ToasterProps = $props();

	const themeState = getTheme();
	const offsetObject = $derived(getOffsetObject(offset, mobileOffset));
	const theme = $derived.by(
		(): NonNullable<ToasterProps['theme']> => themeProp ?? (themeState.current as NonNullable<ToasterProps['theme']> | undefined) ?? LIGHT,
	);
	const toasterStyle = $derived(
		[
			'--normal-bg: var(--color-popover); --normal-text: var(--color-popover-foreground); --normal-border: var(--color-border);',
			restProps.style,
		]
			.filter(Boolean)
			.join(' '),
	);

	const toasterClass = $derived(
		[
			'toaster group',
			join(className),
			'fixed box-border m-0 list-none p-0 outline-none w-(--width) z-999999999',
			'font-sans transition-transform duration-400 ease-[ease]',
			'data-[x-position=right]:right-(--offset-right)',
			'data-[x-position=left]:left-(--offset-left)',
			'data-[x-position=center]:left-1/2 data-[x-position=center]:-translate-x-1/2',
			'data-[y-position=top]:top-(--offset-top)',
			'data-[y-position=bottom]:bottom-(--offset-bottom)',
			'max-[600px]:fixed max-[600px]:right-(--mobile-offset-right)',
			'max-[600px]:left-(--mobile-offset-left) max-[600px]:w-full',
			// !-forced: rtl:/max-[600px]: add no specificity over the plain max-[600px]:left-(...)
			// rule above, so without !important this loses the tie to Tailwind's internal ordering.
			'rtl:max-[600px]:-left-(--mobile-offset-left)!',
			'max-[600px]:data-[x-position=left]:left-(--mobile-offset-left)',
			'max-[600px]:data-[y-position=bottom]:bottom-(--mobile-offset-bottom)',
			'max-[600px]:data-[y-position=top]:top-(--mobile-offset-top)',
			'max-[600px]:data-[x-position=center]:left-(--mobile-offset-left)',
			'max-[600px]:data-[x-position=center]:right-(--mobile-offset-right)',
			'max-[600px]:data-[x-position=center]:translate-x-0',
		]
			.filter(Boolean)
			.join(' '),
	);

	function getDocumentDirection(): ToasterProps['dir'] {
		if (dir !== 'auto') return dir;
		if (typeof window === 'undefined') return 'ltr';
		if (typeof document === 'undefined') return 'ltr'; // For Fresh purpose

		const dirAttribute = document.documentElement.getAttribute('dir') as ToasterProps['dir'];

		if (dirAttribute === 'auto' || !dirAttribute) {
			untrack(() => (dir = (window.getComputedStyle(document.documentElement).direction as ToasterProps['dir']) ?? 'ltr'));
			return dir;
		}

		untrack(() => (dir = dirAttribute));
		return dirAttribute;
	}

	const possiblePositions = $derived(
		Array.from(
			new Set([position, ...toastState.toasts.filter((toast) => toast.position).map((toast) => toast.position)].filter(Boolean)),
		) as Position[],
	);

	let expanded = $state(false);
	let interacting = $state(false);
	const prefersDark = new MediaQuery('prefers-color-scheme: dark');

	const actualTheme = $derived(theme === 'system' ? (prefersDark.current ? DARK : LIGHT) : theme);
	let listRef = $state<HTMLOListElement>();
	let lastFocusedElementRef = $state<HTMLElement | null>(null);
	let isFocusWithin = $state(false);

	const hotkeyLabel = $derived(hotkey.join('+').replace(/Key/g, '').replace(/Digit/g, ''));

	$effect(() => {
		if (toastState.toasts.length <= 1) {
			expanded = false;
		}
	});

	$effect(() => {
		return () => {
			if (listRef && lastFocusedElementRef) {
				lastFocusedElementRef.focus({ preventScroll: true });
				lastFocusedElementRef = null;
				isFocusWithin = false;
			}
		};
	});

	onMount(() => {
		toastState.reset();

		const handleKeydown = (event: KeyboardEvent) => {
			const isHotkeyPressed = hotkey.every((key) => (event as any)[key] || event.code === key);
			if (isHotkeyPressed) {
				expanded = true;
				listRef?.focus();
			}

			if (event.code === 'Escape' && (document.activeElement === listRef || listRef?.contains(document.activeElement))) {
				expanded = false;
			}
		};

		return on(document, 'keydown', handleKeydown);
	});

	const handleBlur: FocusEventHandler<HTMLOListElement> = (event) => {
		onblur?.(event);
		if (isFocusWithin && !event.currentTarget.contains(event.relatedTarget as HTMLElement)) {
			isFocusWithin = false;
			if (lastFocusedElementRef) {
				lastFocusedElementRef.focus({ preventScroll: true });
				lastFocusedElementRef = null;
			}
		}
	};

	const handleFocus: FocusEventHandler<HTMLOListElement> = (event) => {
		onfocus?.(event);
		const isNotDismissable = event.target instanceof HTMLElement && event.target.dataset.dismissible === 'false';

		if (isNotDismissable) return;

		if (!isFocusWithin) {
			isFocusWithin = true;
			lastFocusedElementRef = event.relatedTarget as HTMLElement;
		}
	};

	const handlePointerDown: PointerEventHandler<HTMLOListElement> = (event) => {
		onpointerdown?.(event);
		const isNotDismissable = event.target instanceof HTMLElement && event.target.dataset.dismissible === 'false';

		if (isNotDismissable) return;
		interacting = true;
	};

	const handleMouseEnter: MouseEventHandler<HTMLOListElement> = (event) => {
		onmouseenter?.(event);
		expanded = true;
	};

	const handleMouseLeave: MouseEventHandler<HTMLOListElement> = (event) => {
		onmouseleave?.(event);
		if (!interacting) {
			expanded = false;
		}
	};

	const handleMouseMove: MouseEventHandler<HTMLOListElement> = (event) => {
		onmousemove?.(event);
		expanded = true;
	};

	const handleDragEnd: DragEventHandler<HTMLOListElement> = (event) => {
		ondragend?.(event);
		expanded = false;
	};

	const handlePointerUp: PointerEventHandler<HTMLOListElement> = (event) => {
		onpointerup?.(event);
		interacting = false;
	};
</script>

<!-- eslint-disable-next-line svelte/valid-compile -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<section
	aria-label="{containerAriaLabel} {hotkeyLabel}"
	tabindex={-1}
	aria-live="polite"
	aria-relevant="additions text"
	aria-atomic="false">
	{#if toastState.toasts.length > 0}
		{#each possiblePositions as position, index (position)}
			{@const [y, x] = position.split('-')}
			<!-- eslint-disable-next-line svelte/valid-compile -->
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<ol
				tabindex={-1}
				dir={getDocumentDirection()}
				bind:this={listRef}
				class={toasterClass}
				data-sonner-toaster
				data-sonner-theme={actualTheme}
				data-y-position={y}
				data-x-position={x}
				style:--front-toast-height={`${toastState.heights[0]?.height}px`}
				style:--width={`${TOAST_WIDTH}px`}
				style:--gap={`${gap}px`}
				style:--offset-top={offsetObject['--offset-top']}
				style:--offset-right={offsetObject['--offset-right']}
				style:--offset-bottom={offsetObject['--offset-bottom']}
				style:--offset-left={offsetObject['--offset-left']}
				style:--mobile-offset-top={offsetObject['--mobile-offset-top']}
				style:--mobile-offset-right={offsetObject['--mobile-offset-right']}
				style:--mobile-offset-bottom={offsetObject['--mobile-offset-bottom']}
				style:--mobile-offset-left={offsetObject['--mobile-offset-left']}
				style={toasterStyle}
				onblur={handleBlur}
				onfocus={handleFocus}
				onmouseenter={handleMouseEnter}
				onmousemove={handleMouseMove}
				onmouseleave={handleMouseLeave}
				ondragend={handleDragEnd}
				onpointerdown={handlePointerDown}
				onpointerup={handlePointerUp}
				{...restProps}>
				{#each toastState.toasts.filter((toast) => (!toast.position && index === 0) || toast.position === position) as toast, index (toast.id)}
					<Toast
						{index}
						{toast}
						defaultRichColors={richColors}
						duration={toastOptions?.duration ?? duration}
						class={toastOptions?.class ?? ''}
						descriptionClass={toastOptions?.descriptionClass || ''}
						{invert}
						{visibleToasts}
						{closeButton}
						{interacting}
						{position}
						style={toastOptions?.style ?? ''}
						classes={toastOptions.classes || {}}
						unstyled={toastOptions.unstyled ?? false}
						cancelButtonStyle={toastOptions?.cancelButtonStyle ?? ''}
						actionButtonStyle={toastOptions?.actionButtonStyle ?? ''}
						closeButtonAriaLabel={toastOptions?.closeButtonAriaLabel ?? closeButtonAriaLabel}
						expandByDefault={expand}
						{expanded}
						{pauseWhenPageIsHidden} />
				{/each}
			</ol>
		{/each}
	{/if}
</section>

<style lang="postcss">
	:global {
		[data-sonner-toaster] {
			--gray1: hsl(0, 0%, 99%);
			--gray2: hsl(0, 0%, 97.3%);
			--gray3: hsl(0, 0%, 95.1%);
			--gray4: hsl(0, 0%, 93%);
			--gray5: hsl(0, 0%, 90.9%);
			--gray12: hsl(0, 0%, 9%);
			--border-radius: 8px;
		}

		[data-rich-colors='true'][data-sonner-toast][data-styled='true'] [data-description] {
			color: inherit;
		}

		[data-sonner-toaster][data-sonner-theme='dark'] [data-description] {
			color: hsl(0, 0%, 91%);
		}

		[data-sonner-toaster][data-sonner-theme='dark'] [data-sonner-toast][data-styled='true'] [data-cancel] {
			background: rgba(255, 255, 255, 0.3);
		}

		[data-sonner-toast][data-swiping='true']::before {
			content: '';
			position: absolute;
			left: -100%;
			right: -100%;
			height: 100%;
			z-index: -1;
		}

		[data-sonner-toast][data-y-position='top'][data-swiping='true']::before {
			bottom: 50%;
			transform: scaleY(3) translateY(50%);
		}

		[data-sonner-toast][data-y-position='bottom'][data-swiping='true']::before {
			top: 50%;
			transform: scaleY(3) translateY(-50%);
		}

		[data-sonner-toast][data-swiping='false'][data-removed='true']::before {
			content: '';
			position: absolute;
			inset: 0;
			transform: scaleY(2);
		}

		[data-sonner-toast][data-expanded='true']::after {
			content: '';
			position: absolute;
			left: 0;
			height: calc(var(--gap) + 1px);
			bottom: 100%;
			width: 100%;
		}

		/*
		 * The --y transform cascade MUST live here (not as Tailwind utilities):
		 * the entrance --y (per y-position) and the settled --y ([data-mounted]) have
		 * equal specificity, so source order decides — `mounted` must come AFTER
		 * `y-position` to win. Tailwind re-sorts utilities and emitted `y-position`
		 * last, which froze the front toast at its entrance translateY(±100%) (the
		 * "renders too low / off the page" bug). Keep mounted after the position rules.
		 */
		[data-sonner-toast][data-y-position='top'] {
			top: 0;
			--y: translateY(-100%);
			--lift: 1;
			--lift-amount: calc(1 * var(--gap));
		}

		[data-sonner-toast][data-y-position='bottom'] {
			bottom: 0;
			--y: translateY(100%);
			--lift: -1;
			--lift-amount: calc(var(--lift) * var(--gap));
		}

		[data-sonner-toast][data-mounted='true'] {
			--y: translateY(0);
		}

		[data-sonner-toast][data-expanded='false'][data-front='false'] {
			--scale: var(--toasts-before) * 0.05 + 1;
			--y: translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));
			height: var(--front-toast-height);
		}

		[data-sonner-toast][data-expanded='false'][data-front='false'][data-styled='true'] > * {
			opacity: 0;
		}

		[data-sonner-toast][data-mounted='true'][data-expanded='true'] {
			--y: translateY(calc(var(--lift) * var(--offset)));
			height: var(--initial-height);
		}

		[data-sonner-toast][data-removed='true'][data-front='true'][data-swipe-out='false'] {
			--y: translateY(calc(var(--lift) * -100%));
			opacity: 0;
		}

		[data-sonner-toast][data-removed='true'][data-front='false'][data-swipe-out='false'][data-expanded='true'] {
			--y: translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));
			opacity: 0;
		}

		[data-sonner-toast][data-removed='true'][data-front='false'][data-swipe-out='false'][data-expanded='false'] {
			--y: translateY(40%);
			opacity: 0;
			transition:
				transform 500ms,
				opacity 200ms;
		}

		[data-sonner-toast][data-removed='true'][data-front='false']::before {
			height: calc(var(--initial-height) + 20%);
		}

		[data-sonner-toast][data-swipe-out='true'][data-y-position='bottom'],
		[data-sonner-toast][data-swipe-out='true'][data-y-position='top'] {
			animation-duration: 200ms;
			animation-timing-function: ease-out;
			animation-fill-mode: forwards;
		}

		[data-sonner-toast][data-swipe-out='true'][data-swipe-direction='left'] {
			animation-name: swipe-out-left;
		}

		[data-sonner-toast][data-swipe-out='true'][data-swipe-direction='right'] {
			animation-name: swipe-out-right;
		}

		[data-sonner-toast][data-swipe-out='true'][data-swipe-direction='up'] {
			animation-name: swipe-out-up;
		}

		[data-sonner-toast][data-swipe-out='true'][data-swipe-direction='down'] {
			animation-name: swipe-out-down;
		}

		[data-sonner-toaster][data-sonner-theme='light'] {
			--success-bg: hsl(143, 85%, 96%);
			--success-border: hsl(145, 92%, 87%);
			--success-text: hsl(140, 100%, 27%);

			--info-bg: hsl(208, 100%, 97%);
			--info-border: hsl(221, 91%, 93%);
			--info-text: hsl(210, 92%, 45%);

			--warning-bg: hsl(49, 100%, 97%);
			--warning-border: hsl(49, 91%, 84%);
			--warning-text: hsl(31, 92%, 45%);

			--error-bg: hsl(359, 100%, 97%);
			--error-border: hsl(359, 100%, 94%);
			--error-text: hsl(360, 100%, 45%);
		}

		[data-sonner-toaster][data-sonner-theme='light'] [data-sonner-toast][data-invert='true'] {
			--normal-bg: #000;
			--normal-border: hsl(0, 0%, 20%);
			--normal-text: var(--gray1);
		}

		[data-sonner-toaster][data-sonner-theme='dark'] [data-sonner-toast][data-invert='true'] {
			--normal-bg: #fff;
			--normal-border: var(--gray3);
			--normal-text: var(--gray12);
		}

		[data-sonner-toaster][data-sonner-theme='dark'] {
			--normal-bg-hover: hsl(0, 0%, 12%);
			--normal-border-hover: hsl(0, 0%, 25%);

			--success-bg: hsl(150, 100%, 6%);
			--success-border: hsl(147, 100%, 12%);
			--success-text: hsl(150, 86%, 65%);

			--info-bg: hsl(215, 100%, 6%);
			--info-border: hsl(223, 43%, 17%);
			--info-text: hsl(216, 87%, 65%);

			--warning-bg: hsl(64, 100%, 6%);
			--warning-border: hsl(60, 100%, 9%);
			--warning-text: hsl(46, 87%, 65%);

			--error-bg: hsl(358, 76%, 10%);
			--error-border: hsl(357, 89%, 16%);
			--error-text: hsl(358, 100%, 81%);
		}

		[data-sonner-toaster][data-sonner-theme='dark'] [data-sonner-toast] [data-close-button] {
			background: var(--normal-bg);
			border-color: var(--normal-border);
			color: var(--normal-text);
		}

		[data-sonner-toaster][data-sonner-theme='dark'] [data-sonner-toast] [data-close-button]:hover {
			background: var(--normal-bg-hover);
			border-color: var(--normal-border-hover);
		}

		[data-rich-colors='true'][data-sonner-toast][data-type='success'] {
			background: var(--success-bg);
			border-color: var(--success-border);
			color: var(--success-text);
		}

		[data-rich-colors='true'][data-sonner-toast][data-type='success'] [data-close-button] {
			background: var(--success-bg);
			border-color: var(--success-border);
			color: var(--success-text);
		}

		[data-rich-colors='true'][data-sonner-toast][data-type='info'] {
			background: var(--info-bg);
			border-color: var(--info-border);
			color: var(--info-text);
		}

		[data-rich-colors='true'][data-sonner-toast][data-type='info'] [data-close-button] {
			background: var(--info-bg);
			border-color: var(--info-border);
			color: var(--info-text);
		}

		[data-rich-colors='true'][data-sonner-toast][data-type='warning'] {
			background: var(--warning-bg);
			border-color: var(--warning-border);
			color: var(--warning-text);
		}

		[data-rich-colors='true'][data-sonner-toast][data-type='warning'] [data-close-button] {
			background: var(--warning-bg);
			border-color: var(--warning-border);
			color: var(--warning-text);
		}

		[data-rich-colors='true'][data-sonner-toast][data-type='error'] {
			background: var(--error-bg);
			border-color: var(--error-border);
			color: var(--error-text);
		}

		[data-rich-colors='true'][data-sonner-toast][data-type='error'] [data-close-button] {
			background: var(--error-bg);
			border-color: var(--error-border);
			color: var(--error-text);
		}

		@media (prefers-reduced-motion) {
			[data-sonner-toast],
			[data-sonner-toast] > * {
				transition: none !important;
				animation: none !important;
			}
		}
	}
</style>
