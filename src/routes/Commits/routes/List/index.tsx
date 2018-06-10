import { RouteComponent } from "routes";
import { Stream } from "xstream";
import { VNode } from "@cycle/dom";
import { CommitListItem } from "./components/CommitListItem";
import { createElement } from "snabbdom-pragma";

export const List: RouteComponent = ({ dom, github }) => {
  const commits$ = github.commits();
  const loaded$ = commits$.mapTo(true).startWith(false);
  const commitListItems$ = commits$.map(commits =>
    commits
      .filter(commit => !commit.commit.message.startsWith("Merge"))
      .map(commit => CommitListItem({ dom, commit$: Stream.of(commit) }))
  );
  const navigateTo$ = commitListItems$
    .map(clis => Stream.merge<string>(...clis.map(cli => cli.history)))
    .flatten();
  const commitListItemDoms$ = commitListItems$
    .map<Stream<VNode[]>>(clis => Stream.combine(...clis.map(cli => cli.dom)))
    .flatten();
  const content$ = loaded$
    .map(
      loaded =>
        loaded
          ? commitListItemDoms$.map(commits => <ul>{commits}</ul>)
          : Stream.of(<p>Loading...</p>)
    )
    .flatten();
  const vdom$ = content$.map(content => (
    <div>
      <h2>Commits List {content}</h2>
    </div>
  ));
  const request$ = Stream.of("");
  return {
    dom: vdom$,
    history: navigateTo$,
    github: request$
  };
};
