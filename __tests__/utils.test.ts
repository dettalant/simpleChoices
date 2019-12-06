import { createDiv, createSpan, createButton, setAriaExpanded, setAriaSelected } from "#/utils";
describe("utils function test", () => {
  const testClass = "test_class";
  it("createDiv test", () => {
    const el = createDiv(testClass);
    expect(el instanceof HTMLDivElement).toBeTruthy();
    expect(el.className).toBe(testClass);
  })

  it("createSpan test", () => {
    const el = createSpan(testClass);
    expect(el instanceof HTMLSpanElement).toBeTruthy();
    expect(el.className).toBe(testClass);
  })

  it("createButton test", () => {
    const el = createButton(testClass);
    expect(el instanceof HTMLButtonElement).toBeTruthy();
    expect(el.className).toBe(testClass);
    expect(el.type).toBe("button");
  });

  it("setAriaExpanded test", () => {
    const el = createDiv();
    const ariaExpanded = "aria-expanded";
    expect(el.getAttribute(ariaExpanded)).toBe(null);

    setAriaExpanded(el, false);
    expect(el.getAttribute(ariaExpanded)).toBe("false");

    setAriaExpanded(el, true);
    expect(el.getAttribute(ariaExpanded)).toBe("true");
  })

  it("setAriaSelected test", () => {
    const el = createDiv();
    const ariaSelected = "aria-selected";
    expect(el.getAttribute(ariaSelected)).toBe(null);

    setAriaSelected(el, false);
    expect(el.getAttribute(ariaSelected)).toBe("false");

    setAriaSelected(el, true);
    expect(el.getAttribute(ariaSelected)).toBe("true");
  })

})
