export interface SelectItem {
    value: any;
    label: string;
    selected?: boolean;
}
export interface SelectElements {
    container: HTMLButtonElement;
    label: HTMLSpanElement;
    wrapper: HTMLDivElement;
    current: HTMLDivElement;
    itemWrapper: HTMLDivElement;
    items: HTMLDivElement[];
}
export interface SelectClassNames {
    container: string;
    label: string;
    current: string;
    wrapper: string;
    itemWrapper: string;
    item: string;
}
export interface CheckboxElements {
    container: HTMLButtonElement;
    label: HTMLSpanElement;
    iconWrapper: HTMLDivElement;
}
export declare type CheckboxClassNames = Record<keyof CheckboxElements, string>;
export interface CheckboxIcons {
    outer: SVGElement;
    inner: SVGElement;
}
