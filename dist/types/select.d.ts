import { SelectItem, SelectClassNames, SelectElements } from "#/interfaces";
export default class SimpleSelectBuilder {
    classNames: SelectClassNames;
    constructor(classNames?: Partial<SelectClassNames>);
    get defaultSelectClassNames(): SelectClassNames;
    create(idStr: string, label: string, items: SelectItem[], className?: string): SimpleSelect;
    private genSelectElements;
}
declare class SimpleSelect {
    selectId: string;
    el: SelectElements;
    items: SelectItem[];
    _currentIdx: number;
    /**
     * SimpleSelectのコンストラクタ
     *
     * @param selectId dispatchEventにおける識別名
     * @param el    生成されたselect要素内のHTMLElementまとめ
     * @param items 生成されたselect要素が内包する要素データ
     */
    constructor(selectId: string, el: SelectElements, items: SelectItem[]);
    private dispatchSelectItemEvent;
    updateHighlightItem(itemIdx: number): void;
    private updateCurrentItem;
    private applyEventListeners;
}
export {};
