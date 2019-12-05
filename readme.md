Simple Choices
==============

Javascript choice generator for alternatively `<select>` element.

**NG WORD: reinventing the wheel**

css not included.

```javascript

import {SimpleSelectBuilder} from "simpleChoices";

const builder = new SimpleSelectBuilder();

const items = [
  { value: "value0", label: "label0" },
  { value: "value1", label: "label1" },
  { value: "value2", label: "label2" },
];

const select = builder.create("select_label", items, "select_classname");

document.body.appendChild(select.el.container);
```
