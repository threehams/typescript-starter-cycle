import { Stream, MemoryStream } from "xstream";
import { DOMSource, VNode } from "@cycle/dom";
import { Location } from "@cycle/history";
import isolate from "@cycle/isolate";
import { createElement } from "snabbdom-pragma";

interface Sources {
  dom: DOMSource;
  history: MemoryStream<Location>;
  href$: Stream<string>;
  title$: Stream<string>;
}

interface Sinks {
  dom: Stream<VNode>;
  history: Stream<string>;
}

const xs = Stream;

const NavLinkComponent = ({ dom, history, href$, title$ }: Sources): Sinks => {
  const currentHref$ = history.map(location => location.pathname);
  const active$ = currentHref$
    .map(href => href$.map(h => href === h))
    .flatten();
  const vdom$ = xs
    .combine(href$, active$, title$)
    .map(([href, active, title]) => (
      <a href={href} title={title} className={!!active ? "active" : ""}>
        {title}
      </a>
    ));
  return {
    dom: vdom$,
    history: xs.empty()
  };
};

export const NavLink = (sources: Sources): Sinks =>
  isolate(NavLinkComponent)(sources);
