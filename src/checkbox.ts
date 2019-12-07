import { CheckboxClassNames, CheckboxElements, CheckboxIcons } from "./interfaces";
import { createButton, createSpan, createDiv, createSVG, setAriaChecked } from "./utils";

export class SimpleCheckboxBuilder {
  private readonly classNames: CheckboxClassNames;
  private readonly icons: CheckboxIcons;
  constructor(classNames: Partial<CheckboxClassNames> = {}, icons: Partial<CheckboxIcons> = {}) {
    this.classNames = Object.assign(this.defaultCheckboxClassNames, classNames);
    this.icons = Object.assign(this.defaultCheckboxIcons, icons);
  }

  get defaultCheckboxClassNames(): CheckboxClassNames {
    return {
      container: "simpleCheckbox_container",
      label: "simpleCheckbox_label",
      iconWrapper: "simpleCheckbox_iconWrapper",
    }
  }

  get defaultCheckboxIcons(): CheckboxIcons {
    // material.io: check_box(modified)
    const outerPathDs = ["M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"];

    // material.io: check_box(modified)
    const innerPathDs = ["M17.99 9l-1.41-1.42-6.59 6.59-2.58-2.57-1.42 1.41 4 3.99z"];

    const outer = createSVG(outerPathDs);
    const inner = createSVG(innerPathDs);

    return {
      outer,
      inner
    }
  }

  create(label: string, initialValue: boolean = false, className?: string): SimpleCheckbox {
    const el = this.genCheckboxElements(label, className);
    const checkbox = new SimpleCheckbox(el);

    if (initialValue) checkbox.setChecked(initialValue, false);
    
    return checkbox;
  }

  private genCheckboxElements(label: string, className: string = ""): CheckboxElements {
    const names = this.classNames;
    const containerEl = createButton(names.container + " " + className);
    containerEl.setAttribute("role", "switch");
    setAriaChecked(containerEl, false);
    containerEl.title = label;

    const labelEl = createSpan(names.label);
    labelEl.textContent = label;

    const iconWrapperEl = createDiv(names.iconWrapper);
    [
      this.icons.outer,
      this.icons.inner
    ].forEach(el => iconWrapperEl.appendChild(el));

    [labelEl, iconWrapperEl].forEach(el => containerEl.appendChild(el));

    return {
      container: containerEl,
      label: labelEl,
      iconWrapper: iconWrapperEl
    }
  }
}

export class SimpleCheckbox {
  readonly el: CheckboxElements;
  private _isActive: boolean = false;

  constructor(el: CheckboxElements) {
    this.el = el;

    this.applyEventListeners();
  }

  get isActive(): boolean {
    return this._isActive;
  }

  set isActive(bool: boolean) {
    this.setChecked(bool);
  }

  toggle() {
    // reverse bool
    const bool = !this._isActive;
    this.setChecked(bool);
  }

  setChecked(bool: boolean, isDispatchEvent: boolean = true) {
    this._isActive = bool;
    // aria-checkedも同時に切り替える
    this.updateAriaChecked(bool);
    if (isDispatchEvent) this.dispatchCheckboxEvent();
  }

  private updateAriaChecked(bool: boolean) {
    setAriaChecked(this.el.container, bool)
  }

  private dispatchCheckboxEvent() {
    const ev = new CustomEvent("SimpleCheckboxEvent", {
      detail: this._isActive
    })

    this.el.container.dispatchEvent(ev);
  }

  private applyEventListeners() {
    this.el.container.addEventListener("click", e => {
      this.toggle();
      e.stopPropagation();
    })
  }
}
