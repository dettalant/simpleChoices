export interface SelectItem {
  // select value for inner process
  value: any,
  // select label for UI
  label: string,
  // item id
  // id: number,
  selected?: boolean,
}

export interface SelectElements {
  container: HTMLButtonElement,
  label: HTMLSpanElement,
  wrapper: HTMLDivElement,
  current: HTMLDivElement,
  itemWrapper: HTMLDivElement,
  items: HTMLDivElement[]
}

export interface SelectClassNames {
  // select container
  container: string,
  // select container label
  label: string,
  // select container current value
  current: string,
  // select item outer wrapper
  wrapper: string,
  // select item inner wrapper
  itemWrapper: string,
  // select item
  item: string,
}

export interface CheckboxElements {
  container: HTMLButtonElement,
  label: HTMLSpanElement,
  iconWrapper: HTMLDivElement
}

export type CheckboxClassNames = Record<keyof CheckboxElements, string>;

export interface CheckboxIcons {
  outer: SVGElement,
  inner: SVGElement,
}
