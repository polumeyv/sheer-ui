import { afterEach, beforeEach } from "vitest";
import { cleanup } from "./mount";
import { ResizeObserverStub } from "./resize-observer-stub";

// Registered first, so it runs after a suite's own afterEach: fake timers are already real again.
afterEach(cleanup);

// The sidebar's desktop panel observes itself on mount, so every suite that mounts one needs an
// observer; a fresh stub per test keeps reports from leaking across tests.
beforeEach(ResizeObserverStub.install);
