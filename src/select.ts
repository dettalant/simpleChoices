import { SelectItem, SelectClassNames, SelectElements } from "./interfaces";
import {
  createDiv,
  createSpan,
  createButton,
  setAriaExpanded,
  setAriaSelected
} from "./utils";

export class SimpleSelectBuilder {
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
    const select = new SimpleSelect(el, items);

    // set initial selected
    const selectedIdx = items.findIndex(item => item.selected);
    if (selectedIdx > 0) {
      // selectedIdxが1以上ならば初期設定値を変更しておく
      select.updateCurrentItem(selectedIdx, false);
    };

    return select;
  }

  private genSelectElements(label: string, items: SelectItem[], className: string = ""): SelectElements{
    const names = this.classNames;

    const btnEl = createButton(names.container + " " + className);

    const labelEl = createSpan(names.label);
    labelEl.textContent = label;

    const wrapperEl = createDiv(names.wrapper);

    const currentEl = createDiv(names.current);
    currentEl.textContent = items[0].label;

    const itemWrapperEl = createDiv(names.itemWrapper);

    // set aria expanded;
    [btnEl, itemWrapperEl].forEach(el => setAriaExpanded(el, false));

    const itemEls = items.map((item, i) => {
      const className = names.item + " " + names.item + i;
      const el = createDiv(className);

      el.textContent = item.label;
      el.dataset.itemIdx = i.toString();

      // 0番だけtrue、それ以外はfalseを指定
      setAriaSelected(el, i === 0);

      itemWrapperEl.appendChild(el);
      return el;
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

export class SimpleSelect {
  readonly el: SelectElements;
  readonly items: SelectItem[];
  private _currentIdx: number = 0;
  _isActive: boolean = false;
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
  get isActive(): boolean {
    return this._isActive;
  }

  get currentIdx(): number {
    return this._currentIdx;
  }

  set currentIdx(idx: number) {
    this._currentIdx = idx;
    this.updateCurrentItem(idx);
  }

  get currentItem(): SelectItem {
    return this.items[this._currentIdx]
  }

  updateCurrentItem(itemIdx: number, isDispatchEvent: boolean = true) {
    this.updateCurrentItemLabel(itemIdx);
    this.updateHighlightItem(itemIdx);

    if (isDispatchEvent) this.dispatchSelectItemEvent();
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

  updateCurrentItemLabel(itemIdx: number) {
    const item = this.items[itemIdx];
    if (item) this.el.current.textContent = item.label;
  }

  showDropdown() {
    const {container, itemWrapper} = this.el;
    [container, itemWrapper].forEach(el => setAriaExpanded(el, true));

    this._isActive = true;
  }

  /**
   * ドロップダウンを閉じる
   * hideDropdown後に行う処理を簡便にするため、promiseで包んで返す
   *
   * @return 非同期処理終了後のPromiseオブジェクト
   */
  hideDropdown(): Promise<void> {
    // onKeyDown時にうまく動かなかったので
    // requestAnimationFrameを挟んで実行タイミングをずらす
    return new Promise(res => requestAnimationFrame(() => {
      const {container, itemWrapper} = this.el;
      [container, itemWrapper].forEach(el => setAriaExpanded(el, false));
      this._isActive = false;

      res();
    }));
  }

  private dispatchSelectItemEvent() {
    const ev = new CustomEvent("SimpleSelectItemEvent", {
      detail: this.items[this._currentIdx],
    });

    this.el.container.dispatchEvent(ev);
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

        this.updateCurrentItem(idx)
      })
    });
  }

}
