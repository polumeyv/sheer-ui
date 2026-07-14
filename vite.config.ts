import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// Present only when this package sits inside the mono checkout; a standalone ui-lib clone has no such file.
const monorepoTsconfig = fileURLToPath(new URL('../../../tsconfig.json', import.meta.url));

export default defineConfig({
	css: { lightningcss: { errorRecovery: true } },
	plugins: [
		tailwindcss(),
		sveltekit({
			// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
			// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
			// See https://svelte.dev/docs/kit/adapters for more information about adapters.
			adapter: adapter(),
			preprocess: vitePreprocess({ script: true }),
			// Inherit the monorepo base tsconfig so this lib gets the shared plugin list
			// (typescript-svelte-plugin → @effect/language-service) + diagnostic config.
			// Path is relative to the generated .svelte-kit/tsconfig.json. Skipped outside the
			// mono, where ./tsconfig.json already carries every option the check depends on.
			typescript: {
				config: (c) => {
					if (existsSync(monorepoTsconfig)) c.extends = '../../../../tsconfig.json';
				},
			},
			// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
			vitePlugin: {
				dynamicCompileOptions: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : { runes: true }),
			},
			compilerOptions: {
				// The vendored bits-ui code intentionally reads $state at init in places; upstream
				// ships with these warnings too. Everything outside lib/bits keeps the full surface.
				warningFilter: (warning) => !(warning.code === 'state_referenced_locally' && !!warning.filename?.includes('/lib/bits/')),
			},
		}),
	],
	optimizeDeps: {
		exclude: ['layerchart'],
	},
});
