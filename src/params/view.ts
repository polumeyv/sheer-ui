import type { ParamMatcher } from "@sveltejs/kit";
import { blocks } from "../__registry__/blocks.js";

type BlockName = (typeof blocks)[number];

export const match: ParamMatcher = (param: string): param is BlockName => {
	return blocks.includes(param as BlockName);
};
