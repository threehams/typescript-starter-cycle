import { Layout } from "./";
import { Header } from "components/Header";
import { Stream } from "xstream";
import { header, main } from "@cycle/dom";
import { createElement } from "snabbdom-pragma";

export const HeaderLayout: Layout = ({
  dom,
  history,
  component: { dom: componentDom, ...component }
}) => {
  const headerComponent = Header({ dom, history });
  const vdom$ = Stream.combine(
    headerComponent.dom,
    componentDom || Stream.empty()
  ).map(([headerDom, component]) => (
    <div>
      {header(headerDom)}
      <hr />
      {main(component)}
    </div>
  ));
  return {
    dom: vdom$,
    ...component
  };
};
