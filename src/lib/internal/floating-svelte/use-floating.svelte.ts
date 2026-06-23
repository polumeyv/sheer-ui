import { computePosition } from '@floating-ui/dom';
import { simpleBox } from '$lib/internal/tools/index.js';
import type { UseFloatingOptions, UseFloatingReturn } from './types.js';
import { get } from './floating-utils.svelte.js';

const roundByDPR = (value: number, dpr: number): number => Math.round(value * dpr) / dpr;

export function useFloating(options: UseFloatingOptions): UseFloatingReturn {
	const whileElementsMountedOption = options.whileElementsMounted;
	const openOption = $derived(get(options.open) ?? true);
	const middlewareOption = $derived(get(options.middleware));
	const transformOption = $derived(get(options.transform) ?? true);
	const placementOption = $derived(get(options.placement) ?? 'bottom');
	const strategyOption = $derived(get(options.strategy) ?? 'absolute');
	const sideOffsetOption = $derived(get(options.sideOffset) ?? 0);
	const alignOffsetOption = $derived(get(options.alignOffset) ?? 0);
	const reference = options.reference;

	let x = $state(0);
	let y = $state(0);

	const floating = simpleBox<HTMLElement | null>(null);

	// svelte-ignore state_referenced_locally
	let strategy = $state(strategyOption);

	// svelte-ignore state_referenced_locally
	let placement = $state(placementOption);

	let middlewareData = $state({});
	let isPositioned = $state(false);
	let hasWhileMountedPosition = false;
	let updateRequestId = 0;

	const floatingStyles = $derived.by(() => {
		const node = floating.current;
		const dpr = node?.ownerDocument.defaultView?.devicePixelRatio ?? 1;

		const xVal = node ? roundByDPR(x, dpr) : x;
		const yVal = node ? roundByDPR(y, dpr) : y;

		if (transformOption) {
			return {
				position: strategy,
				left: '0',
				top: '0',
				transform: `translate(${xVal}px, ${yVal}px)`,
				...(dpr >= 1.5 && { willChange: 'transform' }),
			};
		}

		return {
			position: strategy,
			left: `${xVal}px`,
			top: `${yVal}px`,
		};
	});

	let whileElementsMountedCleanup: (() => void) | undefined;

	function update() {
		if (reference.current === null || floating.current === null) return;

		const referenceNode = reference.current;
		const floatingNode = floating.current;
		const requestId = ++updateRequestId;

		computePosition(referenceNode, floatingNode, {
			middleware: middlewareOption,
			placement: placementOption,
			strategy: strategyOption,
		}).then((position) => {
			if (requestId !== updateRequestId) return;
			if (reference.current !== referenceNode || floating.current !== floatingNode) return;

			if (isReferenceHidden(referenceNode)) {
				middlewareData = {
					...middlewareData,
					hide: {
						// oxlint-disable-next-line no-explicit-any
						...(middlewareData as any).hide,
						referenceHidden: true,
					},
				};
				return;
			}

			if (!openOption && x !== 0 && y !== 0) {
				const maxExpectedOffset = Math.max(Math.abs(sideOffsetOption), Math.abs(alignOffsetOption), 15);
				if (position.x <= maxExpectedOffset && position.y <= maxExpectedOffset) return;
			}

			x = position.x;
			y = position.y;
			strategy = position.strategy;
			placement = position.placement;
			middlewareData = position.middlewareData;
			isPositioned = true;
		});
	}

	function cleanup() {
		whileElementsMountedCleanup?.();
		whileElementsMountedCleanup = undefined;
		updateRequestId++;
	}

	function attach() {
		cleanup();

		if (whileElementsMountedOption === undefined) {
			update();
			return;
		}

		if (!openOption) return;
		if (reference.current === null || floating.current === null) return;

		whileElementsMountedCleanup = whileElementsMountedOption(reference.current, floating.current, update);
	}

	function reset() {
		if (!openOption && floating.current === null) {
			isPositioned = false;
		}
	}

	function trackWhileMountedDeps() {
		return [middlewareOption, placementOption, strategyOption, sideOffsetOption, alignOffsetOption, openOption] as const;
	}

	$effect(() => {
		if (whileElementsMountedOption !== undefined) return;
		if (!openOption) return;

		update();
	});

	$effect(attach);

	$effect(() => {
		if (whileElementsMountedOption === undefined) return;

		trackWhileMountedDeps();

		if (!openOption) {
			hasWhileMountedPosition = false;
			return;
		}

		if (!isPositioned) {
			hasWhileMountedPosition = false;
			return;
		}

		if (!hasWhileMountedPosition) {
			hasWhileMountedPosition = true;
			return;
		}

		update();
	});

	$effect(reset);
	$effect(() => cleanup);

	return {
		floating,
		reference,
		get strategy() {
			return strategy;
		},
		get placement() {
			return placement;
		},
		get middlewareData() {
			return middlewareData;
		},
		get isPositioned() {
			return isPositioned;
		},
		get floatingStyles() {
			return floatingStyles;
		},
		get update() {
			return update;
		},
	};
}

function isReferenceHidden(node: unknown): boolean {
	if (typeof Element === 'undefined' || !(node instanceof Element)) return false;
	if (!node.isConnected) return true;
	if (typeof HTMLElement !== 'undefined' && node instanceof HTMLElement && node.hidden) return true;

	return node.getClientRects().length === 0;
}
