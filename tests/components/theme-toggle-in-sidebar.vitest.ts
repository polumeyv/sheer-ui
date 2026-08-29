// ThemeToggle's icons are hidden/shown by CSS keyed on its own `data-dark` stage. The
// sidebar root carries Tailwind's bare `group` class, so any `group-*` variant in the
// toggle also answers to the sidebar and blanks both icons (ui-lib 0.4.1). The real
// Tailwind output for every class in the tree is compiled and applied here, so the
// assertion is on computed opacity, not on class strings.
import { compile } from "tailwindcss";
import { flushSync, mount, unmount } from "svelte";
import { afterEach, describe, expect, test } from "vitest";

function installDesktopViewport() {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: 1024,
  });
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (query: string) => ({
      matches: query.includes("max-width") ? false : true,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

async function applyTailwind() {
  const candidates = new Set<string>();
  for (const el of document.body.querySelectorAll("[class]")) {
    for (const token of el.getAttribute("class")!.split(/\s+/))
      if (token) candidates.add(token);
  }
  const compiler = await compile("@tailwind utilities;");
  const style = document.createElement("style");
  // jsdom's CSSOM rejects `@property`; the icons' opacity doesn't depend on it.
  style.textContent = compiler
    .build([...candidates])
    .replace(/@property[^{]*\{[^}]*\}/g, "");
  document.head.append(style);
  return style;
}

async function renderFixture(dark: boolean) {
  installDesktopViewport();
  const { default: Fixture } =
    await import("./theme-toggle-in-sidebar.fixture.svelte");
  const target = document.createElement("div");
  document.body.append(target);
  const component = mount(Fixture, { target, props: { dark } });
  flushSync();
  const style = await applyTailwind();
  return {
    [Symbol.dispose]() {
      unmount(component);
      style.remove();
    },
  };
}

function visibleIcons(placement: "inside" | "outside") {
  const host = document.body.querySelector(`[data-testid="${placement}"]`)!;
  const shown = (selector: string) =>
    parseFloat(getComputedStyle(host.querySelector(selector)!).opacity || "1") >
    0;
  return { sun: shown(".sun"), moon: shown(".moon") };
}

afterEach(() => {
  document.body.innerHTML = "";
  localStorage.clear();
});

describe("ThemeToggle inside Sidebar.Footer", () => {
  test.each([
    ["light", false, { sun: true, moon: false }],
    ["dark", true, { sun: false, moon: true }],
  ] as const)(
    "%s mode shows exactly the expected icon, inside and outside the sidebar",
    async (_, dark, expected) => {
      using _fixture = await renderFixture(dark);
      expect(visibleIcons("outside")).toEqual(expected);
      expect(visibleIcons("inside")).toEqual(expected);
    },
  );
});
