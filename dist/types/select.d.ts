import { SelectItem, SelectClassNames, SelectElements } from "./interfaces";
export declare class SimpleSelectBuilder {
    private readonly classNames;
    constructor(classNames?: Partial<SelectClassNames>);
    get defaultSelectClassNames(): SelectClassNames;
    create(label: string, items: SelectItem[], className?: string): SimpleSelect;
    private genSelectElements;
}
export declare class SimpleSelect {
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
    /**
     * currentIdx指定を行うsetter
     * 内部変数の書き換えと同時にupdateCurrentItem関数も呼ぶ
     * @param  idx 更新後のインデックス数値
     */
    set currentIdx(idx: number);
    get currentItem(): SelectItem;
    /**
     * 入力インデックス数値の値が選択されたものとして
     * currentItemなどの値を更新する
     * @param  itemIdx         更新先となるインデックス数値
     * @param  isDispatchEvent falseならばdispatchEventしない
     */
    updateCurrentItem(itemIdx: number, isDispatchEvent?: boolean): void;
    /**
     * 選択中要素のハイライトを切り替える
     * @param  itemIdx 更新先となるインデックス数値
     */
    updateHighlightItem(itemIdx: number): void;
    /**
     * 選択中要素ラベル値を書き換える
     * @param  itemIdx 更新先となるインデックス数値
     */
    updateCurrentItemLabel(itemIdx: number): void;
    /**
     * ドロップダウンを開く
     */
    showDropdown(): void;
    /**
     * ドロップダウンを閉じる
     * hideDropdown後に行う処理を簡便にするため、promiseで包んで返す
     *
     * @return 非同期処理終了後のPromiseオブジェクト
     */
    hideDropdown(): Promise<void>;
    /**
     * container elementのカスタムイベントを発火させる
     * "SimpleSelectItemEvent"がカスタムイベント名
     */
    private dispatchSelectItemEvent;
    private onKeyDownHandler;
    private applyEventListeners;
}
