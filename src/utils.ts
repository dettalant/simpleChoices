export const createDiv = (className?: string) => {
  const div = document.createElement("div");
  if (className) div.className = className;
  return div;
};

export const createSpan = (className?: string) => {
  const span = document.createElement("span");
  if (className) span.className = className;
  return span;
};

export const createButton = (className?:  string) => {
  const btn = document.createElement("button");
  if (className) btn.className = className;
  btn.type = "button";
  return btn;
}

export const setAriaSelected = (el: HTMLElement, bool: boolean) => el.setAttribute("aria-selected", bool.toString());

export const setAriaExpanded = (el: HTMLElement, bool: boolean) => el.setAttribute("aria-expanded", bool.toString());

export const setAriaHidden = (el: HTMLElement, bool: boolean) => el.setAttribute("aria-hidden", bool.toString());
