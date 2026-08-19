import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

// `./components/*` in package.json resolves to src/lib/components/*/index.ts, so a component
// directory without one is an exported subpath that resolves to nothing — unless the map
// explicitly nulls that subpath (the shared menu engine behind dropdown/context/menubar is
// internal and stays unexported).
const root = process.cwd();
const componentsDir = join(root, "src/lib/components");
const exportsMap = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).exports as Record<string, unknown>;
const nulled = new Set(
	Object.entries(exportsMap)
		.filter(([key, value]) => key.startsWith("./components/") && value === null)
		.map(([key]) => key.slice("./components/".length)),
);

describe("package exports map", () => {
	for (const dir of readdirSync(componentsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory())) {
		const hasIndex = existsSync(join(componentsDir, dir.name, "index.ts"));
		if (nulled.has(dir.name)) {
			test(`./components/${dir.name} is nulled and has no barrel to leak`, () => {
				expect(hasIndex).toBe(false);
			});
			continue;
		}
		test(`./components/${dir.name} resolves`, () => {
			expect(hasIndex).toBe(true);
		});
	}
});
