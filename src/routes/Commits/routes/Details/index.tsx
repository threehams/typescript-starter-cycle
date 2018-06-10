import { Sources as RouteComponentSources, Sinks } from "components/App";
import { Stream } from "xstream";
import { BackButton } from "components/BackButton";
import { style } from "typestyle";
import { rem } from "csx";
import { Commit } from "drivers/github";
import { createElement } from "snabbdom-pragma";

interface Sources extends RouteComponentSources {
  sha$: Stream<string>;
}

const className = style({
  display: "inline",
  marginLeft: rem(1)
});

const getDom = ({
  commit: {
    message,
    author: { name, email, date }
  }
}: Commit) => (
  <div>
    <h3>{message.split("\n\n")[0]}</h3>,
    <h4>
      <strong>{name}</strong>
      <h4>{email}</h4>
      <h4>
        <em>{date}</em>
      </h4>
    </h4>,
    <p>{message.split("\n\n")[1] || ""}</p>
  </div>
);

export const Details: (sources: Sources) => Partial<Sinks> = ({
  dom,
  github,
  sha$
}) => {
  const backButton = BackButton({ dom });
  const details$ = sha$
    .map(sha => github.commits(sha))
    .flatten()
    .remember();
  const loaded$ = details$
    .mapTo(true)
    .startWith(false)
    .debug();
  const contents$ = loaded$.map(
    loaded =>
      loaded
        ? details$.map(commit => getDom(commit))
        : Stream.of(<h3>Loading...</h3>)
  );
  const vdom$ = Stream.combine(backButton.dom, contents$).map(
    ([backButton, contents]) => (
      <div>
        {backButton}
        <h2 className={className}>Details</h2>
        <hr />
        {contents}
      </div>
    )
  );
  return {
    dom: vdom$,
    history: backButton.history,
    github: sha$
  };
};
