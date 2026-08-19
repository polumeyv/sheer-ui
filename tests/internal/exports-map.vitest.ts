import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

// `./components/*` in package.json resolves to src/lib/components/*/index.ts, so a component
// directory without one is an exported subpath that resolves to nothing.
const componentsDir = join(process.cwd(), "src/lib/components");

describe("package exports map", () => {
	for (const dir of readdirSync(componentsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory())) {
		test(`./components/${dir.name} resolves`, () => {
			expect(existsSync(join(componentsDir, dir.name, "index.ts"))).toBe(true);
		});
	}
});
