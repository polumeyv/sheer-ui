import { describe, test } from 'bun:test';
import { assertMergeFree } from 'overrule/test';
import { registry, compositions, combos, comboKey } from './variants-registry';

// Disjointness invariant: for every variant combo, the merge must be a no-op —
// base/variant strings never set the same CSS property for the same modifier
// prefix. Freshly pulled shadcn components are written in merge semantics and
// will fail here until their overlaps are distributed into the variants.
// Failures name the exact tokens that would be dropped.
for (const { name, fn, axes } of registry) {
	describe(name, () => {
		for (const combo of combos(axes)) {
			test(comboKey(name, combo), () => {
				assertMergeFree(fn(combo));
			});
		}
	});
}

// Same invariant for internal layering compositions (ui component stacking
// classes onto another ui component).
describe('compositions', () => {
	for (const [name, build] of compositions) {
		test(name, () => {
			assertMergeFree(build());
		});
	}
});
