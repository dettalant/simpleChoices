import { SelectItem, SelectClassNames, SelectElements } from "#/interfaces";
import {
  createDiv,
  createSpan,
  createButton,
  setAriaExpanded,
  setAriaSelected
} from "#/utils";

export default class SimpleSelectBuilder {
  private readonly classNames: SelectClassNames;
  constructor(classNames: Partial<SelectClassNames> = {}) {
    this.classNames = Object.assign(this.defaultSelectClassNames, classNames);
  }

  get defaultSelectClassNames(): SelectClassNames {
    return {
      container: "simpleSelect_container",
      label: "simpleSelect_label",
      wrapper: "simpleSelect_wrapper",
      itemWrapper: "simpleSelect_itemWrapper",
      item: "simpleSelect_item",
      current: "simpleSelect_currentItem",
    }
  }

  create(label: string, items: SelectItem[], className?: string): SimpleSelect {
    const el = this.genSelectElements(label, items, className);
    return new SimpleSelect(el, items);
  }

  private genSelectElements(label: string, items: SelectItem[], className: string = ""): SelectElements{
    const names = this.classNames;

    const btnEl = createButton(names.container + " " + className);

    const labelEl = createSpan(names.label);
    labelEl.textContent = label;

    const wrapperEl = createDiv(names.wrapper);

    const currentEl = createSpan(names.current);
    currentEl.textContent = items[0].label;

    const itemWrapperEl = createDiv(names.itemWrapper);

    // set aria expanded;
    [btnEl, itemWrapperEl].forEach(el => setAriaExpanded(el, false));

    const itemEls = items.map((item, i) => {
      const divClassName = names.item + " " + names.item + i;
      const div = createDiv(divClassName);

      div.textContent = item.label;
      div.dataset.itemIdx = i.toString();

      // set aria selected
      (i === 0)
      ? setAriaSelected(div, true)
      : setAriaSelected(div, false);

      itemWrapperEl.appendChild(div);
      return div;
    });

    // append childs
    [
      currentEl,
      itemWrapperEl,
    ].forEach(el => wrapperEl.appendChild(el));

    [
      labelEl,
      wrapperEl
    ].forEach(el => btnEl.appendChild(el));

    return {
      container: btnEl,
      label: labelEl,
      current: currentEl,
      wrapper: wrapperEl,
      itemWrapper: itemWrapperEl,
      items: itemEls,
    };
  }
}

class SimpleSelect {
  readonly el: SelectElements;
  readonly items: SelectItem[];
  private _currentIdx: number = 0;
  isActive: boolean = false;
  /**
   * SimpleSelectのコンストラクタ
   *
   * @param el    生成されたselect要素内のHTMLElementまとめ
   * @param items 生成されたselect要素が内包する要素データ
   */
  constructor(el: SelectElements, items: SelectItem[]) {
    this.el = el;
    this.items = items;

    this.applyEventListeners();
  }

  private dispatchSelectItemEvent(itemIdx: number) {
    const ev = new CustomEvent("SimpleSelectItemEvent", {
      detail: this.items[itemIdx].value,
    });

    this.el.container.dispatchEvent(ev);
  }

  updateHighlightItem(itemIdx: number) {
    // 配列数を越えているidxの場合は早期リターン
    if (itemIdx >= this.el.items.length) return;

    this.el.items.forEach(item => {
      setAriaSelected(item, false);
    })

    const item = this.el.items[itemIdx];
    setAriaSelected(item, true);

    this._currentIdx = itemIdx;
  }

  private updateCurrentItem(itemIdx: number) {
    const item = this.items[itemIdx];
    if (item) this.el.current.textContent = item.label;
  }

  private showDropdown() {
    const {container, itemWrapper} = this.el;
    [container, itemWrapper].forEach(el => setAriaExpanded(el, true));

    this.isActive = true;
  }

  private hideDropdown() {
    // onKeyDown時にうまく動かなかったので
    // requestAnimationFrameを挟んで実行タイミングをずらす
    requestAnimationFrame(() => {
      const {container, itemWrapper} = this.el;
      [container, itemWrapper].forEach(el => setAriaExpanded(el, false));
      this.isActive = false;
    })
  }

  private onKeyDownHandler(e: KeyboardEvent) {
    // イベントのバブリングを停止させる
    e.stopPropagation();

    if (!this.isActive) {
      // 非アクティブ状態の際は特殊モード
      this.showDropdown();
      return;
    }

    const isArrowDown = e.key === "ArrowDown" || e.keyCode === 40;
    const isArrowUp = e.key === "ArrowUp" || e.keyCode === 38;
    const isEnter = e.key === "Enter" || e.keyCode === 13;

    if (isArrowUp) {
      const idx = (this._currentIdx > 0)
        ? --this._currentIdx
        : 0;
      this.updateHighlightItem(idx);
    } else if (isArrowDown) {
      const idx = (this._currentIdx < this.items.length - 1)
        ? ++this._currentIdx
        : this._currentIdx;
      this.updateHighlightItem(idx);
    } else if (isEnter) {
      const idx = this._currentIdx;
      this.updateCurrentItem(idx);
      this.dispatchSelectItemEvent(idx);
      this.hideDropdown();
    }
  }

  private applyEventListeners() {
    const {container, items} = this.el;

    container.addEventListener("blur", () => {
      this.hideDropdown();
    });

    container.addEventListener("click", () => {
      (!this.isActive)
        ? this.showDropdown()
        : this.hideDropdown();
    })

    container.addEventListener("keydown", e => this.onKeyDownHandler(e))

    items.forEach(el => {
      el.addEventListener("mouseenter", () => {
        const idx = parseInt(el.dataset.itemIdx || "", 10);
        this.updateHighlightItem(idx);
      })

      el.addEventListener("click", () => {
        const idx = parseInt(el.dataset.itemIdx || "", 10);

        this.updateCurrentItem(idx);
        this.dispatchSelectItemEvent(idx);
      })
    });
  }

}
