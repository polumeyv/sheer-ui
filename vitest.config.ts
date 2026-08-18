// bun test owns src/lib/**/*.test.ts (pure TS, no DOM); this config owns tests/**/*.vitest.ts (jsdom, mounts components).
import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
	viteConfig,
	defineConfig({
		resolve: {
			conditions: ["browser"],
		},
		test: {
			environment: "jsdom",
			include: ["tests/**/*.vitest.ts"],
			// The mount-heavy suites (sidebar, registry-demo-render) exceed the 5s default
			// under parallel workers on a loaded dev machine; hangs still fail, just later.
			testTimeout: 20_000,
			setupFiles: ["./tests/setup.ts"],
			restoreMocks: true,
		},
	})
);
