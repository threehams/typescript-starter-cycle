import { RouteComponent } from "routes";
import { Stream } from "xstream";
import { createElement } from "snabbdom-pragma";

export const Home: RouteComponent = () => ({
  dom: Stream.of(<h2>Home</h2>),
  history: Stream.empty()
});
