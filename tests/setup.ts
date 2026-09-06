import { beforeEach } from "vitest";
import { ResizeObserverStub } from "./resize-observer-stub";

// The sidebar's desktop panel observes itself on mount, so every suite that mounts one needs an
// observer; a fresh stub per test keeps reports from leaking across tests.
beforeEach(ResizeObserverStub.install);
