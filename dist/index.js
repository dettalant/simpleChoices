/*!
 *   simple_choices.js
 *
 * @author dettalant
 * @version v0.1.6
 * @license MIT License
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const createDiv = (className) => {
    const div = document.createElement("div");
    if (className)
        div.className = className;
    return div;
};
const createSpan = (className) => {
    const span = document.createElement("span");
    if (className)
        span.className = className;
    return span;
};
const createButton = (className) => {
    const btn = document.createElement("button");
    if (className)
        btn.className = className;
    btn.type = "button";
    return btn;
};
const setAriaSelected = (el, bool) => el.setAttribute("aria-selected", bool.toString());
const setAriaExpanded = (el, bool) => el.setAttribute("aria-expanded", bool.toString());
// export const setAriaHidden = (el: HTMLElement, bool: boolean) => el.setAttribute("aria-hidden", bool.toString());

class SimpleSelectBuilder {
    constructor(classNames = {}) {
        this.classNames = Object.assign(this.defaultSelectClassNames, classNames);
    }
    get defaultSelectClassNames() {
        return {
            container: "simpleSelect_container",
            label: "simpleSelect_label",
            wrapper: "simpleSelect_wrapper",
            itemWrapper: "simpleSelect_itemWrapper",
            item: "simpleSelect_item",
            current: "simpleSelect_currentItem",
        };
    }
    create(label, items, className) {
        const el = this.genSelectElements(label, items, className);
        const select = new SimpleSelect(el, items);
        // set initial selected
        let selectedIdx = items.findIndex(item => item.selected);
        if (selectedIdx === -1)
            selectedIdx = 0;
        // 初期化のためにアップデート関数を呼んでおく
        select.updateCurrentItem(selectedIdx, false);
        return select;
    }
    genSelectElements(label, items, className = "") {
        const names = this.classNames;
        const btnEl = createButton(names.container + " " + className);
        const labelEl = createSpan(names.label);
        labelEl.textContent = label;
        const wrapperEl = createDiv(names.wrapper);
        const currentEl = createDiv(names.current);
        const itemWrapperEl = createDiv(names.itemWrapper);
        // set aria expanded;
        [btnEl, itemWrapperEl].forEach(el => setAriaExpanded(el, false));
        const itemEls = items.map((item, i) => {
            const className = names.item + " " + names.item + i;
            const el = createDiv(className);
            el.textContent = item.label;
            el.dataset.itemIdx = i.toString();
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
class SimpleSelect {
    /**
     * SimpleSelectのコンストラクタ
     *
     * @param el    生成されたselect要素内のHTMLElementまとめ
     * @param items 生成されたselect要素が内包する要素データ
     */
    constructor(el, items) {
        this._currentIdx = 0;
        this._isActive = false;
        this.el = el;
        this.items = items;
        this.applyEventListeners();
    }
    get isActive() {
        return this._isActive;
    }
    get currentIdx() {
        return this._currentIdx;
    }
    /**
     * currentIdx指定を行うsetter
     * 内部変数の書き換えと同時にupdateCurrentItem関数も呼ぶ
     * @param  idx 更新後のインデックス数値
     */
    set currentIdx(idx) {
        // 保有items配列を越える数値の場合は早期リターン
        if (idx > this.items.length - 1)
            return;
        this._currentIdx = idx;
        this.updateCurrentItem(idx);
    }
    get currentItem() {
        return this.items[this._currentIdx];
    }
    /**
     * 入力インデックス数値の値が選択されたものとして
     * currentItemなどの値を更新する
     * @param  itemIdx         更新先となるインデックス数値
     * @param  isDispatchEvent falseならばdispatchEventしない
     */
    updateCurrentItem(itemIdx, isDispatchEvent = true) {
        this.updateCurrentItemLabel(itemIdx);
        this.updateHighlightItem(itemIdx);
        if (isDispatchEvent)
            this.dispatchSelectItemEvent();
    }
    /**
     * 選択中要素のハイライトを切り替える
     * @param  itemIdx 更新先となるインデックス数値
     */
    updateHighlightItem(itemIdx) {
        // 配列数を越えているidxの場合は早期リターン
        if (itemIdx >= this.el.items.length)
            return;
        this.el.items.forEach(item => {
            setAriaSelected(item, false);
        });
        const item = this.el.items[itemIdx];
        setAriaSelected(item, true);
        this._currentIdx = itemIdx;
    }
    /**
     * 選択中要素ラベル値を書き換える
     * @param  itemIdx 更新先となるインデックス数値
     */
    updateCurrentItemLabel(itemIdx) {
        const item = this.items[itemIdx];
        if (item)
            this.el.current.textContent = item.label;
    }
    /**
     * ドロップダウンを開く
     */
    showDropdown() {
        const { container, itemWrapper } = this.el;
        [container, itemWrapper].forEach(el => setAriaExpanded(el, true));
        this._isActive = true;
    }
    /**
     * ドロップダウンを閉じる
     * hideDropdown後に行う処理を簡便にするため、promiseで包んで返す
     *
     * @return 非同期処理終了後のPromiseオブジェクト
     */
    hideDropdown() {
        // onKeyDown時にうまく動かなかったので
        // requestAnimationFrameを挟んで実行タイミングをずらす
        return new Promise(res => requestAnimationFrame(() => {
            const { container, itemWrapper } = this.el;
            [container, itemWrapper].forEach(el => setAriaExpanded(el, false));
            this._isActive = false;
            res();
        }));
    }
    /**
     * container elementのカスタムイベントを発火させる
     * "SimpleSelectItemEvent"がカスタムイベント名
     */
    dispatchSelectItemEvent() {
        const ev = new CustomEvent("SimpleSelectItemEvent", {
            detail: this.items[this._currentIdx],
        });
        this.el.container.dispatchEvent(ev);
    }
    onKeyDownHandler(e) {
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
        }
        else if (isArrowDown) {
            const idx = (this._currentIdx < this.items.length - 1)
                ? ++this._currentIdx
                : this._currentIdx;
            this.updateHighlightItem(idx);
        }
        else if (isEnter) {
            const idx = this._currentIdx;
            this.updateCurrentItem(idx);
            this.hideDropdown();
        }
    }
    applyEventListeners() {
        const { container, items } = this.el;
        container.addEventListener("blur", () => {
            this.hideDropdown();
        });
        container.addEventListener("click", () => {
            (!this.isActive)
                ? this.showDropdown()
                : this.hideDropdown();
        });
        container.addEventListener("keydown", e => this.onKeyDownHandler(e));
        items.forEach(el => {
            el.addEventListener("mouseenter", () => {
                const idx = parseInt(el.dataset.itemIdx || "", 10);
                this.updateHighlightItem(idx);
            });
            el.addEventListener("click", () => {
                const idx = parseInt(el.dataset.itemIdx || "", 10);
                this.updateCurrentItem(idx);
            });
        });
    }
}

exports.SimpleSelect = SimpleSelect;
exports.SimpleSelectBuilder = SimpleSelectBuilder;
