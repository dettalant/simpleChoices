import { SimpleSelectBuilder, SimpleCheckboxBuilder } from "../src/index";

const appRoot = document.getElementById("appRoot");
if (!appRoot) throw new Error("appRoot is not found");

const items = [
  { value: "value0", label: "value0" },
  { value: "value1", label: "value1" },
  { value: "value2", label: "value2" },
]

const items2 = [
  { value: "ppp0", label: "ppp0" },
  { value: "ppp1", label: "ppp1" },
  { value: "ppp2", label: "ppp2" },
]

const builder = new SimpleSelectBuilder();

const select0 = builder.create("select0_label", items, "select0_class");
const select1 = builder.create("select1_label", items2, "select1_class");

const checkboxBuilder = new SimpleCheckboxBuilder();
const checkbox0 = checkboxBuilder.create("checkbox0_label", false, "checkbox0_class");
[
  select0.el.container,
  select1.el.container,
  checkbox0.el.container
].forEach((el: HTMLElement) => appRoot.appendChild(el))

checkbox0.el.container.addEventListener("SimpleCheckboxEvent", e => console.log(e));
