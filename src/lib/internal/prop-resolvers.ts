import { boxWith, type Getter, type ReadableBox } from './tools/index.js';
import type { PortalTarget } from './portal';

const createPropResolver =
	<T>(fallback: T) =>
	(getProp: Getter<T | undefined>): ReadableBox<T> =>
		boxWith(() => {
			const prop = getProp();
			return prop !== undefined ? prop : fallback;
		});

export const resolveLocaleProp = createPropResolver<string>('en');

export const resolvePortalToProp = createPropResolver<PortalTarget>('body');
