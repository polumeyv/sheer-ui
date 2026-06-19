import { toast } from 'svelte-sonner';

export { default as Toaster } from './sonner.svelte';
export { toast };

/** Common error tuples for toast.error(...TOAST_ERRORS.connection) */
export const TOAST_ERRORS = {
	connection: ['Connection failed', { description: 'Please check your connection and try again.' }],
	session: ['Session expired', { description: 'Please sign in again to continue.' }],
	unauthorized: ['Unauthorized', { description: 'You do not have permission to perform this action.' }],
	server: ['Something went wrong', { description: 'Please try again later.' }],
} as const;

/** Show error toast — extracts message from Error objects. Returns void for use in `.catch()`. (Session-expired 401s never reach here: the server gate redirects dead-session requests to the IdP.) */
export const toastError = (e: unknown) => void toast.error(Error.isError(e) ? e.message : String(e));
