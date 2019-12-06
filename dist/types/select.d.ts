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
    _isActive: boolean;
    /**
     * SimpleSelectのコンストラクタ
     *
     * @param el    生成されたselect要素内のHTMLElementまとめ
     * @param items 生成されたselect要素が内包する要素データ
     */
    constructor(el: SelectElements, items: SelectItem[]);
    get isActive(): boolean;
    get currentIdx(): number;
    set currentIdx(idx: number);
    get currentItem(): SelectItem;
    updateCurrentItem(itemIdx: number, isDispatchEvent?: boolean): void;
    updateHighlightItem(itemIdx: number): void;
    updateCurrentItemLabel(itemIdx: number): void;
    showDropdown(): void;
    /**
     * ドロップダウンを閉じる
     * hideDropdown後に行う処理を簡便にするため、promiseで包んで返す
     *
     * @return 非同期処理終了後のPromiseオブジェクト
     */
    hideDropdown(): Promise<void>;
    private dispatchSelectItemEvent;
    private onKeyDownHandler;
    private applyEventListeners;
}
export {};
