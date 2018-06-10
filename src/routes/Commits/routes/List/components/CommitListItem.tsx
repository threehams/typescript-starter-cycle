import { Stream } from "xstream";
import { DOMSource, VNode } from "@cycle/dom";
import isolate from "@cycle/isolate";
import { Commit } from "drivers/github";
import { style } from "typestyle";
import { rem } from "csx";
import { createElement } from "snabbdom-pragma";

interface Sources {
  dom: DOMSource;
  commit$: Stream<Commit>;
}

interface Sinks {
  dom: Stream<VNode>;
  history: Stream<string>;
}

const className = style({
  marginBottom: rem(1),
  border: `${rem(0.1)} solid #ddd`,
  padding: rem(1),
  listStyle: "none",
  borderRadius: rem(0.5),
  $nest: {
    "h4, h5": {
      marginTop: 0,
      marginBottom: rem(0.5)
    },
    h5: {
      marginBottom: 0
    }
  }
});

const CommitListItemComponent = ({ dom, commit$ }: Sources): Sinks => {
  const navigateTo$ = commit$
    .map(({ sha }) =>
      dom
        .select("li")
        .events("click", { preventDefault: true })
        .map(_ => `/commits/${sha}`)
    )
    .flatten();
  const vdom$ = commit$.map(
    ({
      commit: {
        message,
        author: { name, date }
      }
    }) => (
      <li className={className}>
        <h4>
          <strong>{message.split("\n\n")[0]}</strong>
        </h4>
        <h5>
          by <strong>{name}</strong> at <em>{date}</em>
        </h5>
      </li>
    )
  );
  return {
    dom: vdom$,
    history: navigateTo$
  };
};

export const CommitListItem = (sources: Sources): Sinks =>
  isolate(CommitListItemComponent)(sources);
