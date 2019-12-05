import { SelectItem, SelectClassNames, SelectElements } from "#/interfaces";
export default class SimpleSelectBuilder {
    private readonly classNames;
    constructor(classNames?: Partial<SelectClassNames>);
    get defaultSelectClassNames(): SelectClassNames;
    create(label: string, items: SelectItem[], className?: string): SimpleSelect;
    private genSelectElements;
}
declare class SimpleSelect {
    readonly el: SelectElements;
    readonly items: SelectItem[];
    private _currentIdx;
    isActive: boolean;
    /**
     * SimpleSelectのコンストラクタ
     *
     * @param el    生成されたselect要素内のHTMLElementまとめ
     * @param items 生成されたselect要素が内包する要素データ
     */
    constructor(el: SelectElements, items: SelectItem[]);
    private dispatchSelectItemEvent;
    updateHighlightItem(itemIdx: number): void;
    private updateCurrentItem;
    private showDropdown;
    private hideDropdown;
    private onKeyDownHandler;
    private applyEventListeners;
}
export {};
