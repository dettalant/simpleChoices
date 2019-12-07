import { SimpleCheckboxBuilder } from "#/checkbox";
import { CheckboxClassNames } from "#/interfaces";

const builder = new SimpleCheckboxBuilder();
const ariaChecked = "aria-checked";

describe("SimpleCheckboxBuilder class test", () => {
  it("custom container classname test", () => {
    const testClass = "test_class";
    const cbox = builder.create("", false, testClass);
    expect(cbox.el.container.className).toContain(testClass);
  });

  it("custom label test", () => {
    const testLabel = "test_label";
    const cbox = builder.create(testLabel);
    expect(cbox.el.label.textContent).toBe(testLabel);
  })

  it("custom clasnames test", () => {
    const names: CheckboxClassNames = {
      container: "test_container",
      label: "test_label",
      iconWrapper: "test_iconWrapper"
    }
    const builder = new SimpleCheckboxBuilder(names);
    const cbox = builder.create("");
    const elClassNames = [
      cbox.el.container.className,
      cbox.el.label.className,
      cbox.el.iconWrapper.className
    ];

    const compNames = [
      names.container,
      names.label,
      names.iconWrapper
    ];

    elClassNames.forEach((name, i) => {
      expect(name).toContain(compNames[i])
    })
  })

  it("initial value test", () => {
    [
      false,
      true
    ].forEach(bool => {
      const cbox = builder.create("", bool);
      expect(cbox.isActive).toBe(bool);
      expect(cbox.el.container.getAttribute(ariaChecked)).toBe(bool.toString());
    })
  })
});

describe("SimpleCheckbox class test", () => {
  it("toggle test", () => {
    const cbox = builder.create("", false);
    expect(cbox.isActive).toBe(false);
    expect(cbox.el.container.getAttribute(ariaChecked)).toBe("false");

    [
      true,
      false,
      true
    ].forEach(bool => {
      cbox.toggle();
      expect(cbox.isActive).toBe(bool);
      expect(cbox.el.container.getAttribute(ariaChecked)).toBe(bool.toString());
    });
  })

  it("assign bool to isActive test", () => {
    const cbox = builder.create("", false);

    [
      true,
      false,
      false
    ].forEach(bool => {
      cbox.isActive = bool;
      expect(cbox.isActive).toBe(bool);
      expect(cbox.el.container.getAttribute(ariaChecked)).toBe(bool.toString());
    })
  })

  it("dispatchCheckboxEvent test", done => {
    const cbox = builder.create("", false)
    cbox.el.container.addEventListener("SimpleCheckboxEvent", ((e: CustomEvent<boolean>) => {
      expect(e.detail).toBe(true);
      done();
    }) as EventListener);

    cbox.setChecked(true, true);
  });

  it("click element test", () => {
    const cbox = builder.create("", false);

    [
      true,
      false,
      true
    ].forEach(bool => {
      cbox.el.container.click();
      expect(cbox.isActive).toBe(bool);
      expect(cbox.el.container.getAttribute(ariaChecked)).toBe(bool.toString());
    });
  })
})
