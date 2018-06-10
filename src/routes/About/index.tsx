import { RouteComponent } from "routes";
import { Stream } from "xstream";
import { createElement } from "snabbdom-pragma";

export const About: RouteComponent = sources => ({
  dom: Stream.of(<h2>About</h2>),
  history: Stream.empty()
});
