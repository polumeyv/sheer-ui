import { describe, expect, test } from 'bun:test';
import { twMerge } from 'tailwind-merge';
import { registry, compositions, combos, classSet, comboKey } from './variants-registry';

// Disjointness invariant: for every variant combo, twMerge must be a no-op —
// base/variant strings never set the same CSS property for the same modifier
// prefix. Freshly pulled shadcn components are written in merge semantics and
// will fail here until their overlaps are distributed into the variants.
for (const { name, fn, axes } of registry) {
	describe(name, () => {
		for (const combo of combos(axes)) {
			test(comboKey(name, combo), () => {
				const out = fn(combo);
				expect(classSet(twMerge(out))).toEqual(classSet(out));
			});
		}
	});
}

// Same invariant for internal layering compositions (ui component stacking
// classes onto another ui component).
describe('compositions', () => {
	for (const [name, build] of compositions) {
		test(name, () => {
			const out = build();
			expect(classSet(twMerge(out))).toEqual(classSet(out));
		});
	}
});
