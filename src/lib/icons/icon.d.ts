/**
 * Type declaration for every `*.svelte` file in this folder, wired up by the `./icons/*` export's
 * `types` condition.
 *
 * Without it, TypeScript resolves an icon import straight to the `.svelte` file and gives up:
 * `svelte-check` copes (it runs the source through svelte2tsx), but a bare tsserver — which is what
 * an editor uses for the `.ts` and `.svelte` files that *import* an icon — does not process `.svelte`
 * modules reached through `node_modules`, and reports "has no default export" (ts1192). Every consumer
 * reaches this package through a workspace symlink, so every icon import hit that.
 *
 * One declaration serves all of them because every icon takes exactly the same props.
 */

import type { Component } from 'svelte';
import type { SVGAttributes } from 'svelte/elements';

declare const Icon: Component<SVGAttributes<SVGSVGElement>>;

export default Icon;
