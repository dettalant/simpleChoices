export interface SelectItem {
  // select value for inner process
  value: string,
  // select label for UI
  label: string,
  // item id
  // id: number,
  selected?: boolean,
}

export interface SelectElements {
  container: HTMLElement,
  label: HTMLElement,
  wrapper: HTMLElement,
  current: HTMLElement,
  itemWrapper: HTMLElement,
  items: HTMLElement[]
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
