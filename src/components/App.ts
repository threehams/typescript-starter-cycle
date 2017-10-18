import { Stream, MemoryStream } from 'xstream';
import { DOMSource, VNode, div } from '@cycle/dom';
import { HistoryInput, Location } from '@cycle/history';
import { resolve } from 'routes';
import { pluck } from 'utils/pluck';

export interface Sources {
  dom: DOMSource;
  history: MemoryStream<Location>;
}

export interface Sinks {
  dom: Stream<VNode>;
  history: Stream<HistoryInput | string>;
}

const xs = Stream;

export const App = (sources: Sources): Sinks => {
  const app$ =
    sources.history
      .map(location => resolve(location.pathname))
      .map(({ getComponent, getLayout, ...resolution }) =>
        xs.fromPromise(
          getComponent()
            .then(Component => Component({ ...sources, ...(resolution.sources || {}) }))
            .then(component =>
              !getLayout
                ? component
                : getLayout().then(Layout => Layout({ ...sources, component }))
          )
        )
      )
      .flatten();
  return {
    dom: pluck(app$, app$ => app$.dom),
    history: pluck(app$, app$ => app$.history)
  };
};
