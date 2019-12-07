import { CheckboxClassNames, CheckboxElements, CheckboxIcons } from "./interfaces";
export declare class SimpleCheckboxBuilder {
    private readonly classNames;
    private readonly icons;
    constructor(classNames?: Partial<CheckboxClassNames>, icons?: Partial<CheckboxIcons>);
    get defaultCheckboxClassNames(): CheckboxClassNames;
    get defaultCheckboxIcons(): CheckboxIcons;
    create(label: string, initialValue?: boolean, className?: string): SimpleCheckbox;
    private genCheckboxElements;
}
export declare class SimpleCheckbox {
    readonly el: CheckboxElements;
    private _isActive;
    constructor(el: CheckboxElements);
    get isActive(): boolean;
    set isActive(bool: boolean);
    toggle(): void;
    setChecked(bool: boolean, isDispatchEvent?: boolean): void;
    private updateAriaChecked;
    private dispatchCheckboxEvent;
    private applyEventListeners;
}
