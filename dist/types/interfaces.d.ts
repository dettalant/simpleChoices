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
