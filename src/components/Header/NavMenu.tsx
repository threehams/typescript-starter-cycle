import { Stream, MemoryStream } from "xstream";
import { DOMSource, VNode } from "@cycle/dom";
import isolate from "@cycle/isolate";
import { style } from "typestyle";
import { rem } from "csx";
import { NavLink } from "../NavLink";
import { Location } from "@cycle/history";
import { createElement } from "snabbdom-pragma";

interface Sources {
  dom: DOMSource;
  history: MemoryStream<Location>;
}

interface Sinks {
  dom: Stream<VNode>;
}

const navLinkHover = {
  cursor: "pointer",
  color: "#666"
};

const className = style({
  display: "flex",
  alignContent: "flex-end",
  $nest: {
    "& > a": {
      color: "#999",
      fontSize: rem(1),
      fontWeight: 700,
      marginRight: rem(1),
      textDecoration: "none",
      transition: "color .3s",
      textTransform: "uppercase",
      $nest: {
        "&:first-child": {
          marginLeft: "auto"
        },
        "&:hover": navLinkHover,
        "&.active": {
          color: "#333"
        }
      }
    }
  }
});

const xs = Stream;
const menuItems = [
  {
    href: "/",
    title: "Home"
  },
  {
    href: "/commits",
    title: "Commits"
  },
  {
    href: "/about",
    title: "About"
  }
];

const NavMenuComponent = ({ dom, history }: Sources): Sinks => {
  const navLinks = menuItems.map(({ href, title }) =>
    NavLink({ dom, history, href$: xs.of(href), title$: xs.of(title) })
  );
  const navLinksDom$ = xs.combine(...navLinks.map(navLink => navLink.dom));
  const vdom$ = navLinksDom$.map(navLinks => (
    <nav className={className}>{navLinks}</nav>
  ));
  return {
    dom: vdom$
  };
};

export const NavMenu = (sources: Sources): Sinks =>
  isolate(NavMenuComponent)(sources);
