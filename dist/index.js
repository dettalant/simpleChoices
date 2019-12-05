/*!
 *   simpleChoices.js
 *
 * @author dettalant
 * @version v0.1.0
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
    create(idStr, label, items, className) {
        const el = this.genSelectElements(label, items, className);
        return new SimpleSelect(idStr, el, items);
    }
    genSelectElements(label, items, className = "") {
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
    /**
     * SimpleSelectのコンストラクタ
     *
     * @param selectId dispatchEventにおける識別名
     * @param el    生成されたselect要素内のHTMLElementまとめ
     * @param items 生成されたselect要素が内包する要素データ
     */
    constructor(selectId, el, items) {
        this._currentIdx = 0;
        this.selectId = selectId;
        this.el = el;
        this.items = items;
        this.applyEventListeners();
    }
    dispatchSelectItemEvent(itemIdx) {
        const ev = new CustomEvent("SimpleSelectItemEvent", {
            detail: this.items[itemIdx].value,
        });
        this.el.container.dispatchEvent(ev);
    }
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
    updateCurrentItem(itemIdx) {
        const item = this.items[itemIdx];
        if (item)
            this.el.current.textContent = item.label;
    }
    applyEventListeners() {
        const { container, itemWrapper, items } = this.el;
        container.addEventListener("focus", () => {
            [container, itemWrapper].forEach(el => setAriaExpanded(el, true));
        });
        container.addEventListener("blur", () => {
            [container, itemWrapper].forEach(el => setAriaExpanded(el, false));
        });
        container.addEventListener("keydown", e => {
            // イベントのバブリングを停止させる
            e.stopPropagation();
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
                this.dispatchSelectItemEvent(idx);
                container.blur();
            }
        });
        // container.addEventListener("click", e => {
        //   toggleAriaExpand(container);
        //   e.stopPropagation();
        // })
        // TODO: キーボード操作も追加する
        items.forEach(el => {
            el.addEventListener("mouseenter", () => {
                const idx = parseInt(el.dataset.itemIdx || "", 10);
                this.updateHighlightItem(idx);
            });
            el.addEventListener("click", () => {
                const idx = parseInt(el.dataset.itemIdx || "", 10);
                this.updateCurrentItem(idx);
                this.dispatchSelectItemEvent(idx);
                // 選択時には親要素のフォーカスを失わせる
                container.blur();
            });
        });
    }
}

exports.SimpleSelectBuilder = SimpleSelectBuilder;
