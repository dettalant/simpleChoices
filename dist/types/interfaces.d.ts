export interface SelectItem {
    value: string;
    label: string;
    selected?: boolean;
}
export interface SelectElements {
    container: HTMLElement;
    label: HTMLElement;
    wrapper: HTMLElement;
    current: HTMLElement;
    itemWrapper: HTMLElement;
    items: HTMLElement[];
}
export interface SelectClassNames {
    container: string;
    label: string;
    current: string;
    wrapper: string;
    itemWrapper: string;
    item: string;
}
