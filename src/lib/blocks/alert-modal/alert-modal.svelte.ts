import type { Snippet } from 'svelte';

export type AlertModalVariant = 'destructive' | 'warning' | 'default';

export interface AlertModalOptions {
	title: string;
	description: string;
	actionLabel?: string;
	cancelLabel?: string;
	variant?: AlertModalVariant;
	/** If set, user must type this text to enable the action button */
	confirmText?: string;
	/** Action handler. Omit for a plain acknowledgement dialog — confirming just closes it. */
	onConfirm?: () => Promise<void> | void;
	/** Optional snippet for custom body content between description and footer */
	content?: Snippet;
}

const VARIANT_DEFAULTS: Record<AlertModalVariant, string> = {
	destructive: 'Remove',
	warning: 'Continue',
	default: 'OK',
};

export class AlertModalState {
	open = $state(false);
	loading = $state(false);
	options = $state<AlertModalOptions | null>(null);
	confirmInput = $state('');

	get canConfirm(): boolean {
		if (!this.options) return false;
		if (this.options.confirmText && this.confirmInput !== this.options.confirmText) return false;
		return !this.loading;
	}

	get actionLabel(): string {
		return this.options?.actionLabel ?? VARIANT_DEFAULTS[this.options?.variant ?? 'default'];
	}

	show(options: AlertModalOptions) {
		this.options = options;
		this.confirmInput = '';
		this.loading = false;
		this.open = true;
	}

	destructive(options: Omit<AlertModalOptions, 'variant'>) {
		this.show({ ...options, variant: 'destructive' });
	}

	warning(options: Omit<AlertModalOptions, 'variant'>) {
		this.show({ ...options, variant: 'warning' });
	}

	async handleConfirm() {
		if (!this.options || !this.canConfirm) return;
		this.loading = true;
		try {
			await this.options.onConfirm?.();
			this.close();
		} catch {
			this.loading = false;
		}
	}

	close() {
		this.open = false;
		this.loading = false;
		this.options = null;
		this.confirmInput = '';
	}
}

export const alertModal = new AlertModalState();

/** True when a thrown value is the server hook's session-expired signal — an HTTP 401 surfaced from a remote call (SvelteKit's client wrapper rethrows it as `HttpError { status, body }`). */
export const isSessionExpired = (e: unknown): boolean => typeof e === 'object' && e !== null && 'status' in e && (e as { status: unknown }).status === 401;

/**
 * Session-expired UX — the same alertModal pattern as the auth app's lockout/429 flows, never the gray error page:
 * acknowledge, then a full navigation so the server hook re-runs auth (silently through the IdP when its session
 * is still alive, otherwise landing on sign-in).
 */
export const recoverSession = () => {
	if (alertModal.open) return; // several remote calls fail together when a session dies — one modal is enough
	alertModal.warning({
		title: 'Session expired',
		description: 'Your session has expired. Please sign in again.',
		actionLabel: 'Sign in',
		onConfirm: () => window.location.reload(),
	});
};

/** `window.onunhandledrejection` net for command/query rejections nobody catches: an expired session must recover via the modal, not die in the console. Mount-once per app (`onMount(watchSessionRejections)`); returns the cleanup. */
export const watchSessionRejections = () => {
	const onrejection = (e: PromiseRejectionEvent) => {
		if (!isSessionExpired(e.reason)) return;
		e.preventDefault();
		recoverSession();
	};
	window.addEventListener('unhandledrejection', onrejection);
	return () => window.removeEventListener('unhandledrejection', onrejection);
};
