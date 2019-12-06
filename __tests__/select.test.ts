import SimpleSelectBuilder from "#/select";
import { SelectClassNames, SelectItem } from "#/interfaces";

const builder = new SimpleSelectBuilder();
const items = [
  {label: "label0", value: "value0"},
  {label: "label1", value: "value1"},
  {label: "label2", value: "value2"},
  {label: "label3", value: "value3"},
  {label: "label4", value: "value4"}
];

describe("SimpleSelectBuilder class test", () => {
  it("create items test", () => {
    const select = builder.create("", items);
    select.el.items.forEach((el, i) => {
      expect(el.dataset.itemIdx).toBe(i.toString());
      expect(el.textContent).toBe(items[i].label);
    })
  })

  it("custom container name test", () => {
    const testClass = "test_class";
    const select = builder.create("", items, testClass);
    expect(select.el.container.className).toContain(testClass);
  });

  it("custom label test", () => {
    const testLabel = "test_label";
    const select = builder.create(testLabel, items);
    expect(select.el.label.textContent).toBe(testLabel);
  })

  it("default selected item test", () => {
    const select = builder.create("", items);
    expect(select.currentIdx).toBe(0);

    const items2 = [
      {label: "label0", value: "value0"},
      {label: "label1", value: "value1", selected: true},
      {label: "label2", value: "value2"},
    ];

    const select2 = builder.create("", items2);
    expect(select2.currentIdx).toBe(1);
    expect(select2.el.current.textContent).toBe(items2[1].label);
    expect(select2.currentItem).toEqual(items2[1]);
  })

  it("custom classnames test", () => {
    const classNames: SelectClassNames = {
      container: "test_container",
      label: "test_label",
      item: "test_item",
      itemWrapper: "test_itemWrapper",
      current: "test_currentItem",
      wrapper: "test_wrapper",
    };
    const builder = new SimpleSelectBuilder(classNames);
    const select = builder.create("", items);

    const elClassNames = [
      select.el.container.className,
      select.el.label.className,
      select.el.current.className,
      select.el.wrapper.className,
      select.el.itemWrapper.className
    ];

    const compClassNames = [
      classNames.container,
      classNames.label,
      classNames.current,
      classNames.wrapper,
      classNames.itemWrapper
    ];

    elClassNames.forEach((name, i) => {
      expect(name).toContain(compClassNames[i]);
    })

    select.el.items.map(el => el.className).forEach(name => {
      expect(name).toContain(classNames.item);
    })
  })
})

describe("SimpleSelect class test", () => {

  it("updateCurrentItemLabel test", () => {
    const select = builder.create("", items);

    expect(select.el.current.textContent).toBe(items[0].label);

    items.forEach((item, i) => {
      select.updateCurrentItemLabel(i);
      expect(select.el.current.textContent).toBe(item.label);
    })
  });

  it("updateHighlightItem test", () => {
    const select = builder.create("", items);
    const ariaSelected = "aria-selected";
    select.el.items.forEach((el, i) => {
      const boolStr = (i === 0) ? "true" : "false"
      expect(el.getAttribute(ariaSelected)).toBe(boolStr);
    });

    items.forEach((_, i) => {
      select.updateHighlightItem(i);
      select.el.items.forEach((el, ii) => {
        const boolStr = (ii === i) ? "true" : "false";
        expect(el.getAttribute(ariaSelected)).toBe(boolStr);
      })
    });
  });

  it("dispatchSelectItemEvent test", done => {
    const select = builder.create("", items);
    let compIdx = 0;
    select.el.container.addEventListener("SimpleSelectItemEvent", ((e: CustomEvent<SelectItem>) => {
      expect(e.detail).toEqual(items[compIdx]);
      done();
    }) as EventListener);
    select["dispatchSelectItemEvent"]();

    items.forEach((_, i) => {
      compIdx = i;
      select.currentIdx = compIdx;
    })
  })

  it("showDropdown and hideDropdown test", done => {
    const select = builder.create("", items);
    const ariaExpanded = "aria-expanded";
    // デフォルトでは非表示状態
    const {container, itemWrapper} = select.el;
    [container, itemWrapper].forEach(el => expect(el.getAttribute(ariaExpanded)).toBe("false"));
    expect(select.isActive).toBeFalsy();

    select.showDropdown();
    [container, itemWrapper].forEach(el => expect(el.getAttribute(ariaExpanded)).toBe("true"));
    expect(select.isActive).toBeTruthy();

    // hideDropdownは非同期処理なのでthen()でテストする必要がある
    select.hideDropdown().then(() => {
      [container, itemWrapper].forEach(el => expect(el.getAttribute(ariaExpanded)).toBe("false"));
      expect(select.isActive).toBeFalsy();

      done();
    })
  });

  it("click element test", () => {
    const select = builder.create("", items);
    document.body.appendChild(select.el.container);

    expect(select.isActive).toBeFalsy();
    const ariaExpanded = "aria-expanded";
    select.el.container.click();
    expect(select.isActive).toBeTruthy();
    expect(select.el.container.getAttribute(ariaExpanded)).toBe("true");

    // hideDropdown関連は非同期でテストが面倒くさいので行っていないことに注意
  })
})
