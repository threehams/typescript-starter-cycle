import { Stream } from "xstream";
import { HistoryInput } from "@cycle/history";
import { DOMSource, VNode } from "@cycle/dom";
import isolate from "@cycle/isolate";
import { createElement } from "snabbdom-pragma";
import classNames from "classnames";

interface Sources {
  dom: DOMSource;
  class$?: Stream<string>;
}

interface Sinks {
  dom: Stream<VNode>;
  history: Stream<HistoryInput>;
}

const BackButtonComponent = ({ dom, class$ }: Sources): Sinks => {
  const goBack$ = dom
    .select("button")
    .events("click", { preventDefault: true })
    .mapTo<HistoryInput>({ type: "goBack" });
  const vdom$ = (class$ || Stream.of("")).map(className => (
    <button className={classNames("back-button", className)}>Back</button>
  ));
  return {
    dom: vdom$,
    history: goBack$
  };
};

export const BackButton = (sources: Sources): Sinks =>
  isolate(BackButtonComponent)(sources);
