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

const boolToString = (bool: boolean) => {
  return (bool) ? "true" : "false"
}

export const setAriaSelected = (el: HTMLElement, bool: boolean) => el.setAttribute("aria-selected", boolToString(bool));

export const setAriaExpanded = (el: HTMLElement, bool: boolean) => el.setAttribute("aria-expanded", boolToString(bool));

export const setAriaChecked = (el: HTMLElement, bool: boolean) => el.setAttribute("aria-checked", boolToString(bool));

// export const setAriaHidden = (el: HTMLElement, bool: boolean) => el.setAttribute("aria-hidden", boolToString(bool));

export const createSVG = (pathDs: string[], viewBox: string = "0 0 24 24") => {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("role", "img");
  svg.setAttribute("xmlns", ns);
  svg.setAttribute("viewBox", viewBox);

  pathDs.forEach(d => {
    const path = document.createElementNS(ns, "path");
    path.setAttribute("d", d);
    svg.appendChild(path);
  })

  return svg;
}
