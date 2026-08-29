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
			// Component <style> blocks are dropped unless listed; the theme-toggle suite asserts
			// computed opacity, which its scoped rules decide.
			css: { include: [/theme-toggle\.svelte/] },
			include: ["tests/**/*.vitest.ts"],
			// The mount-heavy suites (sidebar, registry-demo-render) exceed the 5s default
			// under parallel workers on a loaded dev machine; hangs still fail, just later.
			testTimeout: 20_000,
		},
	})
);
