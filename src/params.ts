import { defineParams } from '@sveltejs/kit/params';
import { blocks } from './__registry__/blocks.js';

type BlockName = (typeof blocks)[number];

export const params = defineParams({
	view: (param) => (blocks.includes(param as BlockName) ? (param as BlockName) : undefined),
});
