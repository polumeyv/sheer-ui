import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-auto';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
			// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
			// See https://svelte.dev/docs/kit/adapters for more information about adapters.
			adapter: adapter(),
			// Inherit the monorepo base tsconfig so this lib gets the shared plugin list
			// (typescript-svelte-plugin → @effect/language-service) + diagnostic config.
			// Path is relative to the generated .svelte-kit/tsconfig.json.
			typescript: {
				config: (c) => {
					c.extends = '../../../../tsconfig.json';
				},
			},
			// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
			vitePlugin: {
				dynamicCompileOptions: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : { runes: true }),
			},
		}),
	],
});
