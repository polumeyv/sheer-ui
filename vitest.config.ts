import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

// Node 22.4+ ships an experimental `localStorage` global that shadows jsdom's and is `undefined` unless
// `--localstorage-file` is given; the flag that turns it off exists from the same version, so older Nodes get none.
const [major = 0, minor = 0] = process.versions.node.split(".").map(Number);
const execArgv = major > 22 || (major === 22 && minor >= 4) ? ["--no-experimental-webstorage"] : [];

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
			execArgv,
		},
	})
);
