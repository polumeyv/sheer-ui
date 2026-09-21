import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.ts";

// Workers are reused across files, so jsdom loads once per worker instead of once per file. These
// suites need a module graph of their own: two count document listeners, and svelte adds one per
// event name any already-loaded component delegates; the third replaces a module with vi.mock.
const isolated = [
	"tests/components/input-modality-global.vitest.ts",
	"tests/components/slider-pointer-drag.vitest.ts",
	"tests/components/use-prevent-scroll-ios.vitest.ts",
];

export default mergeConfig(
	viteConfig,
	defineConfig({
		resolve: {
			conditions: ["browser"],
		},
		test: {
			fsModuleCache: true,
			environment: "jsdom",
			setupFiles: ["tests/setup.ts"],
			restoreMocks: true,
			unstubGlobals: true,
			// Component <style> blocks are dropped unless listed; the theme-toggle suite asserts
			// computed opacity, which its scoped rules decide.
			css: { include: [/theme-toggle\.svelte/] },
			projects: [
				{ test: { name: "shared", isolate: false, include: ["tests/**/*.vitest.ts"], exclude: isolated } },
				{ test: { name: "isolated", include: isolated } },
			],
			// The mount-heavy suites (sidebar, registry-demo-render) exceed the 5s default
			// under parallel workers on a loaded dev machine; hangs still fail, just later.
			testTimeout: 20_000,
		},
	})
);
