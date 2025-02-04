import { test, char } from "./functions";
import "./render.css";
import * as stylis from "stylis";

export function render() {
  const el = document.createElement("div");
  el.classList.add("text");
  document.getElementsByTagName("body")[0].appendChild(el);
  el.innerHTML = `hello, world ${test(char())}`;

  const middlewares = [stylis.stringify];
  const compiled = stylis.compile(`
    .foo {
      background: gray;
    }
  `);
  const serialised = stylis.serialize(
    compiled,
    stylis.middleware([...middlewares])
  );

  el.className = "foo";

  const st = document.createElement("style");
  st.innerText = serialised;
  document.body.appendChild(st);
}
