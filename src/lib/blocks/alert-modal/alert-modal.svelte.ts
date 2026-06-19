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
	// raw: replaced wholesale by show()/close(), never mutated, and it carries a Snippet,
	// which has no business inside a deep proxy
	options = $state.raw<AlertModalOptions | null>(null);
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

// Session-expiry recovery used to live here (isSessionExpired / recoverSession / watchSessionRejections). It's gone:
// the server gate (@polumeyv/boundary idpSessionGate) now redirects dead-session requests — navigations and remote
// calls alike — straight to the IdP, so a logged-out user never surfaces a session error inside the app.