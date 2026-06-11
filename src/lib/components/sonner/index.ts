import { toast } from 'svelte-sonner';
import { isSessionExpired, recoverSession } from '../../blocks/alert-modal/alert-modal.svelte';

export { default as Toaster } from './sonner.svelte';
export { toast };

/** Common error tuples for toast.error(...TOAST_ERRORS.connection) */
export const TOAST_ERRORS = {
	connection: ['Connection failed', { description: 'Please check your connection and try again.' }],
	session: ['Session expired', { description: 'Please sign in again to continue.' }],
	unauthorized: ['Unauthorized', { description: 'You do not have permission to perform this action.' }],
	server: ['Something went wrong', { description: 'Please try again later.' }],
} as const;

/** Show error toast - extracts message from Error objects. Returns void for use in .catch(). A session-expired (401) remote failure diverts to the alertModal + re-auth flow instead of a dead-end toast. */
export const toastError = (e: unknown) => void (isSessionExpired(e) ? recoverSession() : toast.error(e instanceof Error ? e.message : String(e)));
