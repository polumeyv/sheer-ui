import type { Snippet } from 'svelte';
import type { ReadableProp } from '$lib/vendor/index';
import type { TransitionState } from '$lib/vendor/attrs';

export type PresenceLayerProps = {
	/**
	 * Whether to force mount the component.
	 */
	forceMount?: boolean;
};

export type PresenceLayerImplProps = PresenceLayerProps & {
	/**
	 * The open state of the component.
	 */
	open: boolean;

	presence?: Snippet<
		[
			{
				present: boolean;
				transitionStatus: TransitionState;
			},
		]
	>;

	ref: ReadableProp<HTMLElement | null>;
};

export { default as PresenceLayer } from '$lib/components/_shared/utilities/presence-layer/presence-layer.svelte';
