import { SimpleSelectBuilder } from "../src/index";

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

const select0 = builder.create("select0label", items, "select0Class");
const select1 = builder.create("select1label", items2, "select1Class");

[
  select0.el.container,
  select1.el.container
].forEach((el: HTMLElement) => appRoot.appendChild(el))
