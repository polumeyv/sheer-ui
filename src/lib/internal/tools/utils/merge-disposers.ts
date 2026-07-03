import { chain } from 'overrule/props';

/**
 * Merges cleanup/unsubscribe functions into one function that calls all of them. Falsy entries
 * are skipped, so callers can pass a conditional expression in place of a no-op.
 */
export function mergeDisposers(...disposers: Array<(() => void) | null | undefined | false>): () => void {
	return chain(...disposers.filter((dispose): dispose is () => void => typeof dispose === 'function'));
}
